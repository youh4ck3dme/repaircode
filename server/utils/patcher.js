/**
 * Applies a set of patches to a file's content.
 * 
 * @param {string} originalContent - The original text content of the file.
 * @param {Array} changes - An array of change objects.
 * @param {string} changes[].type - The type of change: 'insert', 'delete', or 'replace'.
 * @param {number} changes[].startLine - The 1-indexed starting line number.
 * @param {number} [changes[].endLine] - The 1-indexed ending line number (required for delete and replace).
 * @param {string} [changes[].newCode] - The new code to insert or replace with.
 * @returns {string} The patched file content.
 */
function applyPatches(originalContent, changes) {
    if (!changes || !changes.length) return originalContent;

    let lines = originalContent.split('\n');

    // Sort changes by startLine in descending order.
    // This is crucial because applying changes from the bottom up 
    // prevents line number shifts for subsequent patches in the same file.
    const sortedChanges = [...changes].sort((a, b) => b.startLine - a.startLine);

    for (const change of sortedChanges) {
        const startIdx = change.startLine - 1; // Convert to 0-indexed
        const endIdx = change.endLine ? change.endLine - 1 : startIdx;

        switch (change.type) {
            case 'replace':
                // Replace a range of lines with the new code block
                lines.splice(startIdx, endIdx - startIdx + 1, change.newCode);
                break;

            case 'delete':
                // Remove a range of lines
                lines.splice(startIdx, endIdx - startIdx + 1);
                break;

            case 'insert':
                // Insert new code BEFORE the specified line
                lines.splice(startIdx, 0, change.newCode);
                break;

            default:
                console.warn(`Unknown patch type: ${change.type}`);
        }
    }

    return lines.join('\n');
}

module.exports = { applyPatches };
