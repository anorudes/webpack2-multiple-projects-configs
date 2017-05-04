const fs = require('fs');
const config = JSON.parse(fs.readFileSync('./.babelrc'));
const hook = require('css-modules-require-hook');
const sass = require('node-sass');

hook({
  generateScopedName: process.env.NODE_ENV === 'development'
    ? '[path]__[local]__[hash:base64:3]'
    : '[hash:base64:5]',
  extensions: ['.mscss'],
  preprocessCss: (data, filename) =>
    sass.renderSync({
      data,
      file: filename,
    }).css,
});

// Enable ignore scss and remove prop-types
const ignore = [
  [
    'babel-plugin-transform-require-ignore', {
      extensions: ['.scss'],
    },
  ],
  'react-remove-prop-types',
];

config.plugins = config.plugins.concat(ignore);
require('babel-core/register')(config);
require('asset-require-hook')({
  extensions: ['jpg', 'png', 'svg'],
});

global.__CLIENT__ = false;
global.require = require;

require('../src/server/server-ssr.js');
