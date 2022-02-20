/**
 * 路由入口
 * @author LiQingSong
 */

 import { RoutesDataItem } from "@/utils/routes";

 import SecurityLayout from '@/layouts/SecurityLayout.vue';

 import DefaultLayoutRoutes from "@/layouts/DefaultLayout/routes";
 import DefaultLayout from "@/layouts/DefaultLayout/index.vue";

 import DashboardLayoutRoutes from '@/layouts/DashboardLayout/routes';
 import DashboardLayout from '@/layouts/DashboardLayout/index.vue';


const routes: Array<RoutesDataItem> = [
  {
     title: 'empty',
     path: '/',
     component: SecurityLayout,
     children: [
        {
          title: 'empty',
          path: '/',
          redirect: '/home',
          component: DefaultLayout,
          children: DefaultLayoutRoutes
        },
        {
          title: 'empty',
          path: '/dashboard',
          component: DashboardLayout,
          children: DashboardLayoutRoutes
        },
     ]
  },
  {
    title: 'empty',
    path: '/refresh',
    component: () => import('@/views/refresh/index.vue')
  },
  {
    title: 'app.global.menu.notfound',
    path: '/:pathMatch(.*)*',
    component: () => import('@/views/404/index.vue'),
  }
]





 export default routes;
