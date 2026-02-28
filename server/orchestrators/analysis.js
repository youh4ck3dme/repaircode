import { callGemini, analysisSchema } from "../llm/gemini.js";
import { loadRepoFiles } from "../repo/files.js";
import { saveAnalysis, setJobStatus } from "../db/client.js";
import { chunkFiles } from "./chunking.js";
import { callWithRetry } from "../llm/callWithRetry.js";
import { analysisValidate } from "../schema/validate.js";
import { emitProgress } from "../events/progress.js";

export async function runAnalysis(jobId) {
    try {
        await setJobStatus(jobId, "running");
        emitProgress(jobId, "analysis_start", { message: "Starting codebase analysis..." });

        const files = await loadRepoFiles(jobId);
        const textFiles = files.filter(f => !f.content.includes('// Binary'));
        const chunks = chunkFiles(textFiles);

        const allIssues = [];
        const summaries = [];

        const instruction = "Si seniorný full-stack architekt a bezpečnostný expert. Tvojou úlohou je analyzovať poskytnuté súbory a identifikovať problémy v oblasti bezpečnosti, výkonu a kvality kódu. Zameraj sa LEN na identifikáciu problémov, nenavrhuj riešenia. Každý problém musí mať unikátne ID. Výstup musí byť striktne validný JSON podľa definovanej schémy.";

        for (let i = 0; i < chunks.length; i++) {
            emitProgress(jobId, "analysis_chunk_start", {
                chunk: i + 1,
                total: chunks.length,
                message: `Analyzing chunk ${i + 1} of ${chunks.length}...`
            });

            const prompt = `Analyzuj tieto súbory repozitára a deteguj problémy:\n\n${chunks[i].map(f => `FILE: ${f.path}\n---\n${f.content}`).join("\n\n")}`;

            const json = await callWithRetry({
                fn: () => callGemini(instruction, prompt, analysisSchema),
                validate: analysisValidate
            });

            allIssues.push(...json.issues);
            summaries.push(json.summary);

            emitProgress(jobId, "analysis_chunk_done", { chunk: i + 1 });
        }

        const finalAnalysis = {
            summary: summaries.join("\n\n"),
            issues: allIssues
        };

        await saveAnalysis(jobId, finalAnalysis);
        await setJobStatus(jobId, "done");
        emitProgress(jobId, "analysis_done", { summary: finalAnalysis.summary });

        return finalAnalysis;
    } catch (error) {
        await setJobStatus(jobId, "failed");
        emitProgress(jobId, "error", { message: `Analysis failed: ${error.message}` });
        console.error(`Analysis failed for job ${jobId}:`, error);
        throw error;
    }
}
