import { callGemini, fixesSchema } from "../llm/gemini.js";
import { getAnalysis, saveFixes, setJobStatus } from "../db/client.js";
import { callWithRetry } from "../llm/callWithRetry.js";
import { fixesValidate } from "../schema/validate.js";
import { emitProgress } from "../events/progress.js";

export async function runFixes(jobId) {
    try {
        await setJobStatus(jobId, "running");
        emitProgress(jobId, "fixes_start", { message: "Generating repair plans..." });

        const analysis = await getAnalysis(jobId);

        const instruction = "Si seniorný inžinier. Tvojou úlohou je navrhnúť riešenia pre identifikované problémy z analýzy. Ku každému issueId vráť stručný popis riešenia a jeho dopad. Výstup musí byť validný JSON.";

        const prompt = `Navrhni riešenia pre túto analýzu:\n\n${JSON.stringify(analysis, null, 2)}`;

        const json = await callWithRetry({
            fn: () => callGemini(instruction, prompt, fixesSchema),
            validate: fixesValidate
        });

        await saveFixes(jobId, json);
        await setJobStatus(jobId, "done");
        emitProgress(jobId, "fixes_done", { message: "Repair plans ready." });

        return json;
    } catch (error) {
        await setJobStatus(jobId, "failed");
        emitProgress(jobId, "error", { message: `Fix generation failed: ${error.message}` });
        console.error(`Fixes failed for job ${jobId}:`, error);
        throw error;
    }
}
