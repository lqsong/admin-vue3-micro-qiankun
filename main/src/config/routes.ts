/**
 * 路由入口
 * @author LiQingSong
 */
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css'; // progress bar style
NProgress.configure({ showSpinner: false, easing: 'ease', speed: 1000 }); // NProgress Configuration

import { createRouter, createWebHistory } from 'vue-router';
import { RoutesDataItem } from "@/utils/routes";
import settings from "@/config/settings";

import SecurityLayout from '@/layouts/SecurityLayout.vue';

import QiankunLayoutRoutes from "@/layouts/QiankunLayout/routes";
import QiankunLayout from "@/layouts/QiankunLayout/index.vue";

import UserLayoutRoutes from '@/layouts/UserLayout/routes';
import UserLayout from '@/layouts/UserLayout/index.vue';

const routes: Array<RoutesDataItem> = [
  {
    title: 'empty',
    path: '/',
    component: SecurityLayout,
    children: [
      {
        title: 'empty',
        path: '/',
        redirect: settings.homeRouteItem.path,
        component: QiankunLayout,
        children: QiankunLayoutRoutes
      },
      {
        title: 'empty',
        path: '/refresh',
        component: () => import('@/views/refresh/index.vue')
      },
    ]
  },
  {
    title: 'empty',
    path: '/user',
    redirect: '/user/login',
    component: UserLayout,
    children: UserLayoutRoutes
  },
  {
    title: 'app.global.menu.notfound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue'),
  }
]

const router = createRouter({
  scrollBehavior(/* to, from, savedPosition */) {
    return { top: 0 }
  },
  history: createWebHistory(process.env.MICRO_PUBLIC_PATH),
  routes: routes,
});

router.beforeEach((to, from, next) => {
  // 此判断[if(to.fullPath!==from.fullPath)]为了防止子应用也是vue-router4导致主应用与子应用路由来回跳转执行
  if(to.fullPath !== from.fullPath) {
    // start progress bar
    NProgress.start();
    next()
  }
});

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});

export default router;
