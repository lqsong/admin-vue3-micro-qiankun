const path = require('path');
function resolve(dir) {
  return path.join(__dirname, dir);
}

const { stringified } = require('../scripts/server/env');

const { VUE_APP_PORT } = process.env;

module.exports = {
  publicPath: '/',
  outputDir: 'dist',
  devServer: {
    port: VUE_APP_PORT || 8081
  },
  // 自定义webpack配置
  configureWebpack: {
    resolve: {
      alias: {
        '@': resolve('src'),
      },
    }
  },
  chainWebpack: config => {
    config.plugin('define')
    .tap(args => {
       args[0]['process.env'] = {
         ...args[0]['process.env'],
         ...stringified
       }
      return args
    })
  }
}
