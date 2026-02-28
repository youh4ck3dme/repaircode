const JSZip = require('jszip');

/**
 * Builds a ZIP buffer from a collection of files.
 * 
 * @param {Array} files - Array of { path, content } objects.
 * @returns {Promise<Buffer>} The ZIP file buffer.
 */
async function buildZip(files) {
    const zip = new JSZip();

    for (const file of files) {
        zip.file(file.path, file.content);
    }

    return await zip.generateAsync({ type: 'nodebuffer' });
}

module.exports = { buildZip };
