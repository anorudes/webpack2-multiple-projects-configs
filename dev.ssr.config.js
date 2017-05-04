const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');

module.exports = function (project) {
  const projectExtract = new ExtractTextPlugin({
    filename: `${project}.css`,
    allChunks: true,
  });

  const projectExtractMain = new ExtractTextPlugin({
    filename: 'main.css',
    allChunks: true,
  });

  const sassLoaderInstance = () => {
    return {
      test: new RegExp('styles_' + project + '\.scss'),
      use: projectExtract.extract({
        use: [{
          loader: 'css-loader',
          options: {
            minimize: true,
          },
        }, {
          loader: 'postcss-loader',
        }, {
          loader: 'sass-loader',
        }],
      }),
    };
  };
  
  const mscssLoaderInstance = () => {
    return {
      test: new RegExp('styles_' + project + '\.mscss'),
      use: projectExtract.extract({
        use: [{
          loader: 'css-loader',
          options: {
            modules: true,
            importLoaders: 2,
            localIdentName: '[path]__[local]__[hash:base64:3]',
            minimize: true,
          },
        }, {
          loader: 'postcss-loader',
        }, {
          loader: 'sass-loader',
        }],
      }),
    };
  };


  return {
    devtool: 'source-map',

    entry: {
      [`prj_${project}`]: ['babel-polyfill', './src/index'],
    },

    output: {
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
    },

    module: {
      rules: [
        sassLoaderInstance(),
        {
          test: /^((?!styles_).)*\.scss$/,
          use: projectExtractMain.extract({
            use: [{
              loader: 'css-loader',
              options: {
                minimize: true,
              },
            }, {
              loader: 'postcss-loader',
            }, {
              loader: 'sass-loader',
            }],
          }),
        },
        mscssLoaderInstance(),
        {
          test: /^((?!styles_).)*\.mscss$/,
          use: projectExtractMain.extract({
            use: [{
              loader: 'css-loader',
              options: {
                modules: true,
                importLoaders: 2,
                localIdentName: '[path]__[local]__[hash:base64:3]',
                minimaze: true,
              },
            }, {
              loader: 'postcss-loader',
            }, {
              loader: 'sass-loader',
            }],
          }),
        }],
    },

    plugins: [
      projectExtractMain,
      projectExtract,
      new webpack.HashedModuleIdsPlugin(),
      new WebpackChunkHash(),
      new ManifestPlugin({
        fileName: 'manifest.json',
      }),
      new webpack.ProvidePlugin({
        Promise: 'es6-promise',
      }),
    ],
  };
};
