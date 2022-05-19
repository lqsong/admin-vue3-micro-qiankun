import { createApp } from 'vue';

// 样式初始化
import 'normalize.css';

// 全局样式
import '@/assets/css/global.scss';

// 引入 ElementUI
import ElementPlus from 'element-plus';

// 导入 svg
import { importAllSvg } from "@/components/IconSvg/index";
importAllSvg();

import App from '@/App.vue';
import router from '@/config/routes';
import store from '@/config/store';
import i18n from '@/config/i18n';

const app = createApp(App)
app.use(store);
app.use(router)
app.use(ElementPlus);
app.use(i18n);
app.mount('#app');

// qiankun设置注册
import { registerMicroApps, childProjectAll, mainProps } from "@/qiankun";
const Apps = childProjectAll('main',{ ...mainProps(router, store) });
registerMicroApps(
  Apps,
  {
    beforeLoad: [
      async (app) => {
        store.commit('global/setQiankunStartLoading', true);
        console.log('before load app.name====>>>>>', app.name);
      },
    ],
    beforeMount: [
      async (app) => {
        store.commit('global/setQiankunStartLoading', true);
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterMount: [
      async (app) => {
        store.commit('global/setQiankunStartLoading', false);
        console.log('[LifeCycle] after mount %c%s', 'color: green;', app.name);
      },
    ],
    afterUnmount: [
      async (app) => {
        console.log(
          '[LifeCycle] after unmount %c%s',
          'color: green;',
          app.name
        );
      },
    ],
  }
);
