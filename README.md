# admin-vue3-micro-qiankun

`admin-vue3-micro-qiankun`是一个微前端后台解决方案，它基于 [Qiankun.js](https://qiankun.umijs.org/) 结合 [admin-element-vue](http://admin-element-vue.liqingsong.cc/) 和 [admin-antd-vue](http://admin-antd-vue.liqingsong.cc)实现。


## Demo

| [main-demo](http://main-demo.admin-vue3-micro-qiankun.liqingsong.cc/)  |
:-------------------------:
| [main-antd-demo](http://main-antd-demo.admin-vue3-micro-qiankun.liqingsong.cc/)  |
| ![Home](http://admin-vue3-micro-qiankun.liqingsong.cc/images/index.png)  |

## 使用文档

 - [http://admin-vue3-micro-qiankun.liqingsong.cc](http://admin-vue3-micro-qiankun.liqingsong.cc)
 - [Github](https://github.com/lqsong/admin-vue3-micro-qiankun)
 - [Gitee](https://gitee.com/lqsong/admin-vue3-micro-qiankun)
 - [http://admin-element-vue.liqingsong.cc/tsv2/](http://admin-element-vue.liqingsong.cc/tsv2/)
 - [http://admin-antd-vue.liqingsong.cc](http://dmin-antd-vue.liqingsong.cc)

## 后台前端解决方案列表

 - admin-element-vue（[GitHub](https://github.com/lqsong/admin-element-vue)、[Gitee](https://gitee.com/lqsong/admin-element-vue)）
 - admin-antd-vue（[GitHub](https://github.com/lqsong/admin-antd-vue)、[Gitee](https://gitee.com/lqsong/admin-antd-vue)）
 - admin-antd-react（[GitHub](https://github.com/lqsong/admin-antd-react)、[Gitee](https://gitee.com/lqsong/admin-antd-react)）
 - electron-admin-element-vue（[GitHub](https://github.com/lqsong/electron-admin-element-vue)、[Gitee](https://gitee.com/lqsong/electron-admin-element-vue)）
 - electron-admin-antd-vue（[GitHub](https://github.com/lqsong/electron-admin-antd-vue)、[Gitee](https://gitee.com/lqsong/electron-admin-antd-vue)）
 - electron-admin-antd-react（[GitHub](https://github.com/lqsong/electron-admin-antd-react)、[Gitee](https://gitee.com/lqsong/electron-admin-antd-react)）
 - admin-vue3-micro-qiankun（[GitHub](https://github.com/lqsong/admin-vue3-micro-qiankun)、[Gitee](https://gitee.com/lqsong/admin-vue3-micro-qiankun)）

## 功能

```
- 登录 / 注销 / 注册

- 权限验证
  - 页面权限
  - 按钮操作
  - 权限配置

- 全局功能
  - 国际化多语言
  - 黑白主题
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑（支持自定义配置）
  - tabNav
  - Svg Sprite 图标
  - Mock 数据
  - 权限验证

- 综合实例
  - 引导页
  - main主框架（基于admin-element-vue调整）
  - main-antd主框架（基于admin-antd-vue调整）
  - System子项目（基于admin-element-vue调整）
  - Article子项目（基于admin-element-vue调整）
  - Links子项目 （基于admin-antd-vue调整） 
```


## 项目设置

### 一、Install dependencies,

```
$ pnpm install
```

> 请使用 pnpm , **[pnpm的安装与使用](http://liqingsong.cc/article/detail/26)** 。


### 二、Compiles and hot-reloads for development

```
$ pnpm run serve

# or

$ pnpm run serve:main
$ pnpm run serve:article
```


### 三、构建与发布

1、构建：

```sh
pnpm run build
```


2、上传到服务器，以`nginx`配置为例：

```sh
server {
  listen       8080;
  server_name  localhost;

  location / {
    # root   html;
    # index  index.html index.htm;
    try_files $uri $uri/ /index.html;
  }

  location /child/system {
    # root   html;
    # index  index.html index.htm;
    try_files $uri $uri/ /child/system/index.html;
  }
  # article 和 links 等其他子模块的history 配置同上
}

```


## 捐赠

如果你觉得这个项目帮助到了你，请帮助点击 Star，你也可以请作者喝咖啡表示鼓励.

**ALIPAY**             |  **WECHAT**
:-------------------------:|:-------------------------:
![Alipay](http://uploads.liqingsong.cc/20210430/f62d2436-8d92-407d-977f-35f1e4b891fc.png)  |  ![Wechat](http://uploads.liqingsong.cc/20210430/3e24efa9-8e79-4606-9bd9-8215ce1235ac.png)


