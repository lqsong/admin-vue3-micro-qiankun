declare global {
  interface Window {
    __POWERED_BY_QIANKUN__: string;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
  }
}

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '';
}

import { createApp, App as InstanceApp } from 'vue';
import { createRouter, createWebHistory, createMemoryHistory, Router, RouterHistory } from 'vue-router';

// 全局样式
import '@/assets/css/global.less';

// 引入 Antd
import Antd from 'ant-design-vue';

// 导入 svg
import { importAllSvg } from "@/components/IconSvg/index";
importAllSvg();

// progress bar
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
NProgress.configure({ showSpinner: false, easing: 'ease', speed: 1000 }); // NProgress Configuration


import App from '@/App.vue';
import routes from '@/config/routes';
import store from '@/config/store';
import i18n from '@/config/i18n';


let router: Router | null = null;
let instance: InstanceApp | null = null;
let history: RouterHistory | null = null;
// 创建vue应用函数
function render(props: any = {}) {
  const {
    container, onGlobalStateChange, setGlobalState, routerBase,
    parentRouter, closeCurrentHeadTabNav, routerHistory, data
  } = props;

  // vue 路由设置
  const historyBase = routerBase || process.env.MICRO_PUBLIC_PATH;
  if (routerHistory === 'memory') {
    history = createMemoryHistory(historyBase);
  } else {
    history = createWebHistory(historyBase);
  }
  router = createRouter({
    history,
    routes,
  });
  router.beforeEach((to, from, next) => {
    // 此判断[if(to.fullPath!==from.fullPath)]为了防止主应用也是vue-router4导致主应用与子应用路由来回跳转执行
    if(to.fullPath !== from.fullPath) {
      // 此判断[if (typeof window.history.state?.current === 'string' && router)]是因为主应用用的是vue-router4,与子应用vue-router4相互冲突，导致点击浏览器返回按钮，路由错误的问题
      if (typeof window.history.state?.current === 'string' && router) {
        const url = process.env.MICRO_PUBLIC_PATH + window.history.state.current.substring(1);
        window.history.state.current = url.replace(new RegExp(router.options.history.base, 'g'), '')
      }
      // start progress bar
      NProgress.start();
      next()
    }
  });
  router.afterEach(() => {
    // 此判断[if (typeof window.history.state?.current === 'string' && router)]是因为主应用用的是vue-router4,与子应用vue-router4相互冲突，导致点击浏览器返回按钮，路由错误的问题
    if (typeof window.history.state === 'object' && router) {
      const url = router.options.history.base +  (window.history.state.current || '');
      window.history.state.current = `/${url.substring(process.env.MICRO_PUBLIC_PATH ? process.env.MICRO_PUBLIC_PATH.length : 1)}`
    }

    // finish progress bar
    NProgress.done();
  });

  // vue 创建应用
  instance = createApp(App);
  instance.provide('qiankunSetGlobalState', setGlobalState);
  instance.provide('parentRouter', parentRouter);
  instance.provide('parentCloseCurrentHeadTabNav', closeCurrentHeadTabNav);
  instance.use(store);
  instance.use(router);
  instance.use(Antd);
  instance.use(i18n);
  instance.mount(container ? container.querySelector('#app') : '#app');

  // 是否跳转指定默认路由path
  if (data?.defaultPath) {
    router.push(data.defaultPath);
  }

  // qiankun.js 全局 state
  onGlobalStateChange?.((state, prev) => {
    // 设置语言
    if(state.i18nLocale && state.i18nLocale !== prev.i18nLocale) {
      i18n.global.locale.value = state.i18nLocale
    }

    // 设置用户登录信息
    if(state.currentUser) {
      store.commit('user/saveCurrentUser', state.currentUser);
    }
  }, true);


}

// 不在qiankun微服务中，独立执行
if(!window.__POWERED_BY_QIANKUN__){
    render();
}

// qiankun微服务中 - 生命周期钩子 - 初始化
export async function bootstrap() {
  console.log('%c%s', 'color: green;', 'links app bootstraped');
}

// qiankun微服务中 - 生命周期钩子 - 进入
export async function mount(props: any) {
  console.log('%c%s', 'color: blue;', 'links app mount');
  render(props);
}

// qiankun微服务中 - 生命周期钩子 - 切出/卸载
export async function unmount() {
  console.log('%c%s', 'color: red;', 'links app unmount');
  if(instance) {
    instance.unmount();
    instance._container.innerHTML = '';
    instance = null;
  }
  router = null;
  history?.destroy();
}

// qiankun微服务中 - 生命周期钩子 - 可选，仅使用 loadMicroApp 方式加载微应用时生效
export async function update(props) {
  console.log('%c%s', 'color: yellow;', 'links app update loadMicroApp');
}
