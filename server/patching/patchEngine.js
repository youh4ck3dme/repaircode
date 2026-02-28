import JSZip from "jszip";
import { applyPatchToFile } from "./applyPatch.js";
import { saveFixedZip } from "../repo/files.js";

export async function applyPatchesAndBuildZip(jobId, files, patchJson) {
    const zip = new JSZip();
    const patchMap = new Map();

    for (const p of patchJson.patches ?? []) {
        patchMap.set(p.file, p.changes || []);
    }

    for (const file of files) {
        const changes = patchMap.get(file.path);
        const finalContent = changes
            ? applyPatchToFile(file.content, changes)
            : file.content;
        zip.file(file.path, finalContent);
    }

    const buffer = await zip.generateAsync({ type: "nodebuffer" });
    await saveFixedZip(jobId, buffer);
    return true;
}
