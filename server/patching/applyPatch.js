export function applyPatchToFile(content, changes) {
    let lines = content.split("\n");
    const sorted = [...changes].sort((a, b) => b.startLine - a.startLine);

    for (const c of sorted) {
        const start = c.startLine - 1;
        const end = (c.endLine ?? c.startLine) - 1;

        if (c.type === "delete") {
            lines.splice(start, end - start + 1);
        }

        if (c.type === "replace") {
            const newLines = c.newCode.split("\n");
            lines.splice(start, end - start + 1, ...newLines);
        }

        if (c.type === "insert") {
            const newLines = c.newCode.split("\n");
            lines.splice(start, 0, ...newLines);
        }
    }

    return lines.join("\n");
}
