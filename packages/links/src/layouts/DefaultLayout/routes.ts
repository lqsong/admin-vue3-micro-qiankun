import { RoutesDataItem } from "@/utils/routes";

const DefaultLayoutRoutes: Array<RoutesDataItem> = [
  {
    title: 'home',
    path: '/home',
    component: ()=> import('@/views/home/index.vue')
  },
  {
    title: 'list',
    path: '/list',
    roles: ['links-list'],
    component: ()=> import('@/views/list/index.vue')
  },
  {
    title: 'category',
    path: '/category',
    roles: ['links-category'],
    component: ()=> import('@/views/category/index.vue')
  },


];

export default DefaultLayoutRoutes;
