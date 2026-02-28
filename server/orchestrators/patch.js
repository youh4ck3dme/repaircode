import { callGemini, patchSchema } from "../llm/gemini.js";
import { getAnalysis, getFixes, savePatch, setJobStatus } from "../db/client.js";
import { loadRepoFiles } from "../repo/files.js";
import { applyPatchesAndBuildZip } from "../patching/patchEngine.js";

export async function runPatch(jobId) {
    try {
        const analysis = await getAnalysis(jobId);
        const fixes = await getFixes(jobId);
        const files = await loadRepoFiles(jobId);

        const instruction = `You are an AST-aware code transformation engine. Your task is to generate precise, minimal, and safe patch instructions for the provided repository.

Rules for patch generation:
1. Only generate patches for files that were explicitly provided in the FILES section.
2. Never invent new files, paths, or directories.
3. Never modify code outside the specified line ranges.
4. All line numbers must correspond exactly to the provided file content.
5. All patches must be minimal — change only what is necessary to implement the fix.
6. Preserve existing indentation, formatting, and code style.
7. newCode must contain ONLY valid code — no comments, explanations, or markdown.
8. If a fix cannot be safely applied, skip it rather than guessing.
9. Do not merge multiple unrelated changes into a single patch block.
10. Do not include any text outside the final JSON object.`;

        const prompt = `
ANALYSIS:
${JSON.stringify(analysis, null, 2)}

FIXES:
${JSON.stringify(fixes, null, 2)}

FILES:
${files.map(f => `FILE: ${f.path}\n---\n${f.content}`).join("\n\n")}
`;

        const json = await callGemini(instruction, prompt, patchSchema);

        await savePatch(jobId, json);
        await applyPatchesAndBuildZip(jobId, files, json);
        await setJobStatus(jobId, "done");

        return true;
    } catch (error) {
        await setJobStatus(jobId, "failed");
        console.error(`Patch failed for job ${jobId}:`, error);
        throw error;
    }
}
