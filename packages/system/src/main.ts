declare global {
  interface Window {
    __POWERED_BY_QIANKUN__: string;
    __INJECTED_PUBLIC_PATH_BY_QIANKUN__: string;
  }
}

if (window.__POWERED_BY_QIANKUN__) {
  __webpack_public_path__ = window.__INJECTED_PUBLIC_PATH_BY_QIANKUN__ || '';
}

import { createApp } from 'vue';
import { createRouter, createWebHistory, createMemoryHistory } from 'vue-router';

// 样式初始化
import 'normalize.css';

// 全局样式
import '@/assets/css/global.scss';

// 引入 ElementUI
import ElementPlus from 'element-plus';

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


let router: any = null;
let instance: any = null;
let history: any = null;

function render(props: any = {}) {
  const { container, routerBase, routerHistory, parentRouter, parentStore, data, onGlobalStateChange } = props;
  const historyBase = routerBase || process.env.BASE_URL;

  if (routerHistory === 'memory') {
    history = createMemoryHistory(historyBase);
  } else {
    history = createWebHistory(historyBase);
  }
  router = createRouter({
    history,
    routes,
  });

  router.beforeEach((/* to, from */) => {
    // start progress bar
    NProgress.start();
  });

  router.afterEach(() => {
    // finish progress bar
    NProgress.done();
  });


  if(parentStore) {
    // 设置用户登录信息
    store.commit('user/saveCurrentUser', parentStore.state.user.currentUser || {});
  }

  instance = createApp(App);
  instance.provide('parentRouter', parentRouter || router);
  instance.provide('parentStore', parentStore || store);
  instance.use(store);
  instance.use(router);
  instance.use(ElementPlus);
  instance.use(i18n);
  instance.mount(container ? container.querySelector('#app') : '#app');

  if (data?.defaultPath) {
    router.push(data.defaultPath);
  }

  // qiankun.js 全局 state
  onGlobalStateChange?.((state, prev) => {
    // 设置语言
    if(state.i18nLocale) {
      i18n.global.locale.value = state.i18nLocale
    }
  }, true);


}

if(!window.__POWERED_BY_QIANKUN__){
    render();
}

export async function bootstrap() {
  console.log('%c%s', 'color: green;', 'system app bootstraped');
}

export async function mount(props: any) {
  console.log('%c%s', 'color: blue;', 'system app mount');
  render(props);
}

export async function unmount() {
  console.log('%c%s', 'color: red;', 'system app unmount');
  instance.unmount();
  instance._container.innerHTML = '';
  instance = null;
  router = null;
  history.destroy();
}

