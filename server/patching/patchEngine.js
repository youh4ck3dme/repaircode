import JSZip from "jszip";
import { applyPatchToFile } from "./applyPatch.js";
import { saveFixedZip } from "../repo/files.js";

export async function applyPatchesAndBuildZip(jobId, files, patchJson) {
    const zip = new JSZip();
    const processedFiles = new Set();
    const patchMap = new Map();

    for (const p of patchJson.patches ?? []) {
        patchMap.set(p.file, p);
    }

    // Process existing files
    for (const file of files) {
        const patch = patchMap.get(file.path);
        const finalContent = patch
            ? applyPatchToFile(file.content, patch.changes)
            : file.content;
        zip.file(file.path, finalContent);
        processedFiles.add(file.path);
    }

    // Process new files
    for (const p of patchJson.patches ?? []) {
        if (p.newFile && !processedFiles.has(p.file)) {
            const finalContent = applyPatchToFile("", p.changes);
            zip.file(p.file, finalContent);
        }
    }

    const buffer = await zip.generateAsync({ type: "nodebuffer" });
    await saveFixedZip(jobId, buffer);
    return true;
}
