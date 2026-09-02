const fs = require('fs/promises');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

/**
 * Reads data from a JSON file in the data directory.
 * @param {string} filename - Name of file (e.g. 'users.json')
 * @returns {Promise<Array|Object>} Parsed JSON content
 */
async function readData(filename) {
  const filePath = path.join(DATA_DIR, filename);
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(content || '[]');
  } catch (err) {
    if (err.code === 'ENOENT') {
      await writeData(filename, []);
      return [];
    }
    throw err;
  }
}

/**
 * Writes data safely to a JSON file in the data directory.
 * @param {string} filename - Name of file (e.g. 'users.json')
 * @param {Array|Object} data - Data to stringify and write
 */
async function writeData(filename, data) {
  const filePath = path.join(DATA_DIR, filename);
  const tempPath = `${filePath}.tmp`;
  const content = JSON.stringify(data, null, 2);
  
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(tempPath, content, 'utf-8');
  await fs.rename(tempPath, filePath);
}

module.exports = {
  readData,
  writeData
};
