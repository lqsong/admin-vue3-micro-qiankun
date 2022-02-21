import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import store from './store';
import { registerMicroApps, start, childProjectAll } from "../../scripts/server/qiankun";

createApp(App).use(store).use(router).mount('#app');

const Apps = childProjectAll('main');
registerMicroApps(
  Apps,
  {
    beforeLoad: [
      async (app) => {
        console.log('before load app.name====>>>>>', app.name);
      },
    ],
    beforeMount: [
      async (app) => {
        console.log('[LifeCycle] before mount %c%s', 'color: green;', app.name);
      },
    ],
    afterMount: [
      async (app) => {
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

start();
