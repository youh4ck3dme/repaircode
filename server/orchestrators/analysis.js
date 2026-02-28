import { callGemini, analysisSchema } from "../llm/gemini.js";
import { loadRepoFiles } from "../repo/files.js";
import { saveAnalysis, setJobStatus } from "../db/client.js";

export async function runAnalysis(jobId) {
    try {
        await setJobStatus(jobId, "running");
        const files = await loadRepoFiles(jobId);

        // Filter for text files
        const textFiles = files.filter(f => !f.content.includes('// Binary'));

        const instruction = "Si seniorný full-stack architekt a bezpečnostný expert. Tvojou úlohou je analyzovať poskytnuté súbory a identifikovať problémy v oblasti bezpečnosti, výkonu a kvality kódu. Pre každý problém musíš navrhnúť konkrétnu opravu. Výstup musí byť striktne validný JSON podľa definovanej schémy.";

        const prompt = `Analyzuj tieto súbory repozitára:\n\n${textFiles.map(f => `FILE: ${f.path}\n---\n${f.content}`).join("\n\n")}`;

        const json = await callGemini(instruction, prompt, analysisSchema);

        await saveAnalysis(jobId, json);
        await setJobStatus(jobId, "done");
        return json;
    } catch (error) {
        await setJobStatus(jobId, "failed");
        console.error(`Analysis failed for job ${jobId}:`, error);
        throw error;
    }
}
