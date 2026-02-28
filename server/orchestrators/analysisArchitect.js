import { callGemini, architectSchema } from "../llm/gemini.js";
import { loadRepoFiles } from "../repo/files.js";
import { saveAnalysis, setJobStatus } from "../db/client.js";
import { chunkFiles } from "./chunking.js";
import { callWithRetry } from "../llm/callWithRetry.js";
import { architectValidate } from "../schema/validate.js";
import { emitProgress } from "../events/progress.js";

export async function runAnalysisArchitect(jobId) {
    try {
        await setJobStatus(jobId, "running");
        emitProgress(jobId, "architect_analysis_start", { message: "Starting architectural analysis..." });

        const files = await loadRepoFiles(jobId);
        const textFiles = files.filter(f => !f.content.includes('// Binary'));
        const chunks = chunkFiles(textFiles);

        const allRefactors = [];
        const summaries = [];

        const instruction = `Si seniorný softvérový architekt. Tvojou úlohou je analyzovať poskytnutý kód a identifikovať "architectural smells" a štrukturálne problémy.
Zameraj sa na:
- God Objects (príliš veľké komponenty/triedy)
- Porušenie Separation of Concerns
- Duplicitu kódu vyžadujúcu abstrakciu
- Nevhodné pomenovania alebo štruktúru priečinkov
- Možnosti pre "Extract Component" alebo "Extract Function"

Výstup musí byť striktne validný JSON podľa definovanej schémy. Každý návrh (refactor) musí mať unikátne ID.`;

        for (let i = 0; i < chunks.length; i++) {
            emitProgress(jobId, "analysis_chunk_start", {
                chunk: i + 1,
                total: chunks.length,
                message: `Analyzing architecture in chunk ${i + 1} of ${chunks.length}...`
            });

            const prompt = `Analyzuj architektúru týchto súborov:\n\n${chunks[i].map(f => `FILE: ${f.path}\n---\n${f.content}`).join("\n\n")}`;

            const json = await callWithRetry({
                fn: () => callGemini(instruction, prompt, architectSchema),
                validate: architectValidate
            });

            allRefactors.push(...json.refactors);
            summaries.push(json.summary);

            emitProgress(jobId, "analysis_chunk_done", { chunk: i + 1 });
        }

        const finalAnalysis = {
            summary: summaries.join("\n\n"),
            refactors: allRefactors
        };

        // We reuse saveAnalysis but store refactors instead of issues
        await saveAnalysis(jobId, finalAnalysis);
        await setJobStatus(jobId, "done");
        emitProgress(jobId, "architect_analysis_done", { summary: finalAnalysis.summary });

        return finalAnalysis;
    } catch (error) {
        await setJobStatus(jobId, "failed");
        emitProgress(jobId, "error", { message: `Architectural analysis failed: ${error.message}` });
        console.error(`Architect analysis failed for job ${jobId}:`, error);
        throw error;
    }
}
