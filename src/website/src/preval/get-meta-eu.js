// @preval

const { resolve } = require('path');
const matter = require('gray-matter');
const glob = require('glob');

const dir = '../pages/eu';

const files = glob
  .sync('**/*.@(md|mdx)', {
    cwd: resolve(__dirname, dir),
    ignore: '**/_jsdoc/**',
  })
  .sort((a, b) => a.localeCompare(b, 'en'));

const getUrl = (file) =>
  `/eu/${file
    .replace('docs', '')
    .replace('index', '')
    .replace('.mdx', '')
    .replace('.md', '')
    .replace('./', '')}/`.replace('//', '/');

const meta = files.map((file) => {
  const front = matter.read(resolve(__dirname, dir, file));
  return {
    key: `./${file}`,
    attributes: {
      ...front.data,
      url: getUrl(file),
      isTab: file.includes('docs'),
    },
    document: () => null,
  };
});

module.exports = meta;
