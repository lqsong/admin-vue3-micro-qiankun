import { RoutesDataItem } from "@/utils/routes";

const DefaultLayoutRoutes: Array<RoutesDataItem> = [
  {
    title: 'home',
    path: '/home',
    component: ()=> import('@/views/home/index.vue')
  },
  {
    title: 'accountlist',
    path: '/accountlist',
    roles: ['setting-accountlist'],
    component: ()=> import('@/views/accountlist/index.vue')
  },
  {
    title: 'rolelist',
    path: '/rolelist',
    roles: ['setting-rolelist'],
    component: ()=> import('@/views/rolelist/index.vue')
  },
  {
    title: 'menulist',
    path: '/menulist',
    roles: ['setting-menulist'],
    component: ()=> import('@/views/menulist/index.vue')
  },
  {
    title: 'apilist',
    path: '/apilist',
    roles: ['setting-apilist'],
    component: ()=> import('@/views/apilist/index.vue')
  },


];

export default DefaultLayoutRoutes;
