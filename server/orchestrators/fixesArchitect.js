import { callGemini, architectFixesSchema } from "../llm/gemini.js";
import { getAnalysis, saveFixes, setJobStatus } from "../db/client.js";
import { callWithRetry } from "../llm/callWithRetry.js";
import { architectFixesValidate } from "../schema/validate.js";
import { emitProgress } from "../events/progress.js";

export async function runFixesArchitect(jobId) {
    try {
        await setJobStatus(jobId, "running");
        emitProgress(jobId, "architect_fixes_start", { message: "Generating architectural refactoring plan..." });

        const analysis = await getAnalysis(jobId);

        const instruction = "Si seniorný softvérový architekt. Tvojou úlohou je navrhnúť konkrétne kroky pre implementáciu navrhnutých refaktoringov. Ku každému refactorId vráť zoznam logických krokov (napr. 'create new file', 'move logic', 'update imports'). Výstup musí byť validný JSON.";

        const prompt = `Navrhni implementačné kroky pre tieto refaktoringy:\n\n${JSON.stringify(analysis, null, 2)}`;

        const json = await callWithRetry({
            fn: () => callGemini(instruction, prompt, architectFixesSchema),
            validate: architectFixesValidate
        });

        // We reuse saveFixes but it stores actions instead of fixes
        await saveFixes(jobId, json);
        await setJobStatus(jobId, "done");
        emitProgress(jobId, "architect_fixes_done", { message: "Refactoring plan ready." });

        return json;
    } catch (error) {
        await setJobStatus(jobId, "failed");
        emitProgress(jobId, "error", { message: `Refactoring plan generation failed: ${error.message}` });
        console.error(`Architect fixes failed for job ${jobId}:`, error);
        throw error;
    }
}
