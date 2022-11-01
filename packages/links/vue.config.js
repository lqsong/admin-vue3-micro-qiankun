/* eslint-disable @typescript-eslint/no-var-requires */
const { stringified } = require('../../scripts/server/env');
const { NODE_ENV, VUE_APP_PORT, VUE_APP_MOCK } = process.env;

const port = process.env.MICRO_LINKS_PORT ||VUE_APP_PORT || 8078;
const packageName = process.env.MICRO_LINKS_ROOT_DIR || 'links';

let publicPath = `//${process.env.MICRO_LINKS_HOST}:${port}${process.env.MICRO_PUBLIC_PATH}`;
let vuePublicPath = process.env.MICRO_PUBLIC_PATH
if(process.env.NODE_ENV === 'production') {
  vuePublicPath = publicPath = `${process.env.MICRO_PUBLIC_PATH}${process.env.MICRO_BUILD_CHILD_NAME}/${packageName}/`;
}

const bodyParser = require('body-parser')
const mockServer = require('./src/utils/mock/server');

module.exports = {
    publicPath: vuePublicPath,
    outputDir: 'dist',
    productionSourceMap: false,
    devServer: {
        port,
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
        },
        // 关闭主机检查，使微应用可以被 fetch，否则会提示生命周期未注册
        disableHostCheck: true,
        // 配置跨域请求头，解决开发环境的跨域问题
        headers: {
          'Access-Control-Allow-Origin': '*'
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
        },
        output: {
          // 微应用的包名，这里与主应用中注册的微应用名称一致
          library: `${packageName}-[name]`,
          // 将你的 library 打包成 umd 库格式,暴露为所有的模块定义下都可运行的方式
          libraryTarget: 'umd',
          // 按需加载相关，设置为 webpackJsonp_VueMicroApp 即可
          jsonpFunction: `webpackJsonp_${packageName}`,
        },
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
