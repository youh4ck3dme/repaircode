import { callGemini, patchSchema } from "../llm/gemini.js";
import { getAnalysis, getFixes, savePatch, setJobStatus } from "../db/client.js";
import { loadRepoFiles } from "../repo/files.js";
import { applyPatchesAndBuildZip } from "../patching/patchEngine.js";
import { callWithRetry } from "../llm/callWithRetry.js";
import { patchValidate } from "../schema/validate.js";
import { emitProgress } from "../events/progress.js";

export async function runPatch(jobId) {
    try {
        await setJobStatus(jobId, "running");
        emitProgress(jobId, "patch_start", { message: "Generating surgical patches..." });

        const analysis = await getAnalysis(jobId);
        const fixes = await getFixes(jobId);
        const files = await loadRepoFiles(jobId);

        const instruction = `Si seniorný expert na transformáciu kódu. Tvojou úlohou je vygenerovať presné patchy pre repozitár na základe poskytnutej analýzy a navrhovaných riešení.

Pravidlá pre generovanie patchov:
1. Používaj výhradne poskytnuté súbory.
2. Generuj len patchy typu insert, delete alebo replace.
3. Patch musí byť minimálny a zachovávať štýl kódu.
4. startLine a endLine musia presne sedieť na poskytnutý obsah.
5. newCode musí byť čistý kód (pri delete prázdny string).
6. Výstup musí byť striktne JSON podľa schémy.`;

        const prompt = `
ANALYSIS:
${JSON.stringify(analysis, null, 2)}

FIXES:
${JSON.stringify(fixes, null, 2)}

FILES:
${files.map(f => `FILE: ${f.path}\n---\n${f.content}`).join("\n\n")}
`;

        const json = await callWithRetry({
            fn: () => callGemini(instruction, prompt, patchSchema),
            validate: patchValidate
        });

        await savePatch(jobId, json);
        await applyPatchesAndBuildZip(jobId, files, json);
        await setJobStatus(jobId, "done");
        emitProgress(jobId, "patch_done", { message: "Repository repaired successfully." });

        return true;
    } catch (error) {
        await setJobStatus(jobId, "failed");
        emitProgress(jobId, "error", { message: `Patching failed: ${error.message}` });
        console.error(`Patch failed for job ${jobId}:`, error);
        throw error;
    }
}
