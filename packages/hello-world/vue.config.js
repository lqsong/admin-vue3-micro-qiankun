const path = require('path');
const { name } = require('./package');

function resolve(dir) {
  return path.join(__dirname, dir);
}
const { stringified } = require('../../scripts/server/env');

const port = process.env.MICRO_HELLO_WORLD_PORT || process.env.VUE_APP_PORT || 8089;
const publicPath = process.env.NODE_ENV === 'production' ?
`/${process.env.MICRO_BUILD_CHILD_NAME}/${process.env.MICRO_HELLO_WORLD_ROOT_DIR}/`
: `http://${process.env.MICRO_HELLO_WORLD_HOST}:${port}/`;

module.exports = {
  publicPath,
  filenameHashing: true,
  devServer: {
    hot: true,
    disableHostCheck: true,
    port,
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    },
    output: {
      // 把子应用打包成 umd 库格式
      library: `${name}-[name]`,
      libraryTarget: 'umd',
      jsonpFunction: `webpackJsonp_${name}`,
    },
  },
  chainWebpack: (config) => {
    config.module
      .rule('fonts')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'fonts/[name].[hash:8].[ext]',
            // publicPath,
          },
        },
      })
      .end();

    config.module
      .rule('images')
      .use('url-loader')
      .loader('url-loader')
      .options({
        limit: 4096, // 小于4kb将会被打包成 base64
        fallback: {
          loader: 'file-loader',
          options: {
            name: 'img/[name].[hash:8].[ext]',
            // publicPath,
          },
        },
      });

    config.plugin('define')
      .tap(args => {
         args[0]['process.env'] = {
           ...args[0]['process.env'],
           ...stringified
         }
        return args
      });

  }
}
