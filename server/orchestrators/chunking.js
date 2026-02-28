export function chunkFiles(files, maxFilesPerChunk = 20, maxCharsPerChunk = 40000) {
    const chunks = [];
    let current = [];
    let size = 0;

    for (const f of files) {
        const len = f.content.length;
        if (current.length >= maxFilesPerChunk || (size + len > maxCharsPerChunk && current.length > 0)) {
            chunks.push(current);
            current = [];
            size = 0;
        }
        current.push(f);
        size += len;
    }
    if (current.length) chunks.push(current);
    return chunks;
}
