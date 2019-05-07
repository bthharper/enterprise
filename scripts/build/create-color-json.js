/** @fileoverview
 * This module takes the ids colors and extracts out properties used in the ids code for use.
 * In the future this could be expanded to extract more token information as needed.
 */

// Libs
const del = require('del');
const fs = require('fs');
const glob = require('glob');
const logger = require('../logger');
const path = require('path');
const slash = require('slash');

const NL = process.platform === 'win32' ? '\r\n' : '\n';
const ROOT_DIR = slash(process.cwd());
const PATHS = {
  srcGlob: `${ROOT_DIR}/node_modules/ids-identity/dist/theme-*/tokens/web/theme-*[^.simple].json`,
  dest: `${ROOT_DIR}/src/components/theme`
}

let IS_VERBOSE = false;

/**
 * Remove any previously "built" directories/files
 */
async function cleanFiles() {
  if (IS_VERBOSE) {
    logger('info', `Cleaning Color JSON files...${NL}`);
  }

  const files = glob.sync(`${PATHS.dest}/*.json`);
  try {
    await del(files);
  } catch (err) {
    logger('error', err);
  }
}

/**
 * Only get properties we need
 * @param {object} obj The original object
 */
function createNewCustomObj(obj) {
  let newObj = {};

  // Loop for color names: 'amber', 'azure'...
  Object.keys(obj).forEach(colorName => {
    newObj[colorName] = {};

    if (obj[colorName].hasOwnProperty('name')) {
      // For colors w/o variants: black, white...
      newObj[colorName].name = obj[colorName].name;
      newObj[colorName].value = obj[colorName].value;

    } else {
      // Loop for color variants: 10, 20, 30...
      Object.keys(obj[colorName]).forEach(colorNum => {
        newObj[colorName][colorNum] = {
          name: obj[colorName][colorNum].name,
          value: obj[colorName][colorNum].value
        }
      });
    }
  });

  return newObj;
}

/**
 * Create a json meta data file of token colors
 * @param  {string} filePath The file path
 * @returns {Promise} Resolve array of icons
 */
const createJSONfile = (filePath) => {
  return new Promise((resolve, reject) => {
    const themeObj = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    const themeColorPaletteObj = createNewCustomObj(themeObj.theme.color.palette);
    const themeColorStatusObj = createNewCustomObj(themeObj.theme.color.status);

    const colorsOnlyObj = {
      color: {
        palette: themeColorPaletteObj,
        status: themeColorStatusObj
      }
    }
    const fileName = path.basename(filePath, '.json') + '-colors.json';
    fs.writeFileSync(`${PATHS.dest}/${fileName}`, JSON.stringify(colorsOnlyObj), 'utf-8');
    resolve(fileName);
  });
}

/**
 * Create JSON file of color palette and status tokens
 * @returns {Promise} Resolve the created file name
 */
function createColorJsonFiles() {
  if (IS_VERBOSE) {
    logger('info', `Running build process create JSON Color files...${NL}`);
  }

  const themeFiles = glob.sync(PATHS.srcGlob);

  return Promise.all(themeFiles.map(createJSONfile))
    .then(filesCreated => {
      if (IS_VERBOSE) {
        logger('success', `${filesCreated.length} JSON Token Files generated into "${PATHS.dest.replace(process.cwd(), '')}"`);
      }
    })
    .catch(err => logger('error', err));
}

/**
 * Main Build function
 * @param  {string} verbose Will generate more error messages.
 * @returns {Promise} A promise
 */
function createColorJson(verbose) {
  IS_VERBOSE = verbose;
  return cleanFiles().then(createColorJsonFiles);
}

module.exports = createColorJson;
