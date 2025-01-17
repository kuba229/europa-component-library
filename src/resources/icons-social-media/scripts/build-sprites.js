const path = require('path');
const glob = require('glob');

const writeSprite = require('./write-sprite');

const src = path.resolve(__dirname, '../dist/svg');
const dest = path.resolve(__dirname, '../dist/sprites');
const files = glob
  .sync('**/*.svg', { cwd: src })
  .sort((a, b) => a.localeCompare(b, 'en'));

/* Generate 1 sprite with all icons and organize icons per folder */

writeSprite({ files, cwd: src, dest, outputFile: `icons-social-media.svg` });
