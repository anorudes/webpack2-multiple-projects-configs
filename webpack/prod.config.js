const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const WebpackChunkHash = require('webpack-chunk-hash');
const ManifestPlugin = require('webpack-manifest-plugin');
const ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');

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
            localIdentName: '[hash:base64:5]',
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
    entry: {
      main: ['babel-polyfill', './src/index'],
    },

    output: {
      filename: '[name].[chunkhash].js',
      chunkFilename: '[name].[chunkhash].chunk.js',
    },

    module: {
      rules: [
        {
          test: new RegExp(`styles_(?!${project}).*\.scss`),
          loader: 'null-loader',
        }, {
          test: new RegExp(`styles_(?!${project}).*\.mscss`),
          loader: 'null-loader',
        },
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
                localIdentName: '[hash:base64:5]',
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
      new ChunkManifestPlugin({
        filename: 'chunk-manifest.json',
        manifestVariable: 'webpackManifest',
      }),
      new webpack.ProvidePlugin({
        Promise: 'es6-promise',
      }),
      new webpack.LoaderOptionsPlugin({
        minimize: true,
      }),
      new webpack.optimize.UglifyJsPlugin({
        compress: {
          warnings: false,
        },
      }),
    ],
  };
};
