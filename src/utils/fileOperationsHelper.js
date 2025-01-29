const path = require('path');
const fs = require('fs');

/**
 * Generates a unique filename for a file to be uploaded, ensuring no conflicts in the given upload directory.
 * It replaces spaces with underscores and appends a counter to the filename if a file with the same name already exists.
 *
 * @param {string} originalName - The original filename of the file to be uploaded.
 * @param {string} uploadDir - The directory where the file will be uploaded.
 * @returns {string} - A unique filename that doesn't conflict with existing files in the upload directory.
 */
const generateUniqueFilename = (originalName, uploadDir) => {

    let fileName = originalName.replace(/\s+/g, '_');

    let fileExt = path.extname(fileName);
    let baseName = path.basename(fileName, fileExt);
    let counter = 1;
    while (fs.existsSync(path.join(uploadDir, fileName))) {
        fileName = `${baseName}(${counter})${fileExt}`;
        counter++;
    }
    return fileName;
};

module.exports = { generateUniqueFilename };
