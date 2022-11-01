/* eslint-disable @typescript-eslint/no-var-requires */
const { stringified } = require('../scripts/server/env');
const bodyParser = require('body-parser')
const mockServer = require('./src/utils/mock/server');
const { NODE_ENV, VUE_APP_PORT, VUE_APP_MOCK } = process.env;


const publicPath =  process.env.MICRO_PUBLIC_PATH;

module.exports = {
    publicPath,
    outputDir: 'dist',
    productionSourceMap: false,
    devServer: {
        port: VUE_APP_PORT || 9090,
        // 配置反向代理
        /*
        proxy: {
            '/api': {
              target: '<url>',
              ws: true,
              changeOrigin: true
            },
            '/foo': {
              target: '<other_url>'
            }
        },
        */
        before: function(app, server) {
            if(NODE_ENV === 'development' && VUE_APP_MOCK === 'true') {
                // parse app.body
                // https://expressjs.com/en/4x/api.html#req.body
                // create application/json parser
                app.use(bodyParser.json());
                // create application/x-www-form-urlencoded parser
                app.use(bodyParser.urlencoded({ extended: false}));
                mockServer(app);
            }
        }
    },
    css: {
        loaderOptions: {
            less: {
                javascriptEnabled: true,
            }
        }
    },
    // 修改webpack的配置
    configureWebpack: {
        // 不需要打包的插件
        externals: {
            // 'vue': 'Vue',
            // 'vue-router': 'VueRouter',
        }
    },
    chainWebpack(config) {

        // 内置的 svg Rule 添加 exclude
        config.module
        .rule('svg')
        .exclude.add(/iconsvg/)
        .end();

        // 添加 svg-sprite-loader Rule
        config.module
        .rule('svg-sprite-loader')
        .test(/.svg$/)
        .include.add(/iconsvg/)
        .end()
        .use('svg-sprite-loader')
        .loader('svg-sprite-loader');

        // 添加 svgo Rule
        config.module
        .rule('svgo')
        .test(/.svg$/)
        .include.add(/iconsvg/)
        .end()
        .use('svgo-loader')
        .loader('svgo-loader')
        .options({
            // externalConfig 配置特殊不是相对路径，起始路径是根目录
            externalConfig: './src/assets/iconsvg/svgo.yml',
        });

        // 针对图片修改publicPath
        config.module
        .rule('images')
        .use('url-loader')
        .loader('url-loader')
        .options({
          limit: 4096, // 小于4kb将会被打包成 base64
          fallback: {
            loader: 'file-loader',
            options: {
              publicPath
            },
          },
        });

        // 添加自定义环境变量
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
