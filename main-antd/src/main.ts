import { createApp } from 'vue';

// 全局样式
import '@/assets/css/global.less';

// 引入 Antd
import Antd from 'ant-design-vue';

// 导入 svg
import { importAllSvg } from "@/components/IconSvg/index";
importAllSvg();

import App from '@/App.vue';
import router from '@/config/routes';
import store from '@/config/store';
import i18n from '@/config/i18n';

import { registerMicroApps, childProjectAll, childProjectEntry, actions } from "../../scripts/server/qiankun";

const app = createApp(App)
app.provide('childProjectEntry', childProjectEntry);
app.provide('qiankunActions', actions);
app.use(store);
app.use(router)
app.use(Antd);
app.use(i18n);
app.mount('#app');

const Apps = childProjectAll('main-antd',{parentRouter: router, parentStore: store});
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
