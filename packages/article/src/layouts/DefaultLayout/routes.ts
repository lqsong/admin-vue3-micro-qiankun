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
    roles: ['article-list'],
    component: ()=> import('@/views/list/index.vue')
  },
  {
    title: 'add',
    path: '/add',
    roles: ['article-add'],
    component: ()=> import('@/views/add/index.vue')
  },
  {
    title: 'edit',
    path: '/edit',
    roles: ['article-edit'],
    component: ()=> import('@/views/edit/index.vue')
  },
  {
    title: 'category',
    path: '/category',
    roles: ['article-category'],
    component: ()=> import('@/views/category/index.vue')
  },


];

export default DefaultLayoutRoutes;
