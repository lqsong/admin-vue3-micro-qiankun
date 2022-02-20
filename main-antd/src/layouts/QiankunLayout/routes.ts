import { RoutesDataItem } from "@/utils/routes";
import BlankLayout from '@/layouts/BlankLayout.vue';
import QianKunStart from '@/views/qiankun/start.vue';
import QianKunStartScreen from '@/views/qiankun/startScreen.vue'
import settings from "@/config/settings";

const QiankunLayoutRoutes: Array<RoutesDataItem> = [
    {
      ...settings.homeRouteItem
    },
    {
      icon: 'menu-article',
      title: 'qiankun-layout.menu.article',
      path: '/article',
      redirect: '/article/list',
      roles: ['article'],
      component: BlankLayout,
      children: [
        {
          title: 'qiankun-layout.menu.article.list',
          path: 'list',
          roles: ['article-list'],
          component: QianKunStartScreen
        },
        {
          hidden: true,
          title: 'qiankun-layout.menu.article.add',
          path: 'add',
          roles: ['article-add'],
          component: QianKunStart,
          selectLeftMenu: '/article/list'
        },
        {
          hidden: true,
          title: 'qiankun-layout.menu.article.edit',
          path: 'edit',
          roles: ['article-edit'],
          component: QianKunStart,
          selectLeftMenu: '/article/list'
        },
        {
          title: 'qiankun-layout.menu.article.category',
          path: 'category',
          roles: ['article-category'],
          component: QianKunStartScreen
        },
        /*
        {
          hidden: true,
          title: ':chapters*',
          path: '/article/:chapters*',
          component: QianKunStart,
        },
        */
      ]
    },

    {
      icon: 'menu-links',
      title: 'qiankun-layout.menu.links',
      path: '/links',
      redirect: '/links/list',
      roles: ['links'],
      component: BlankLayout,
      children: [
        {
          title: 'qiankun-layout.menu.links.list',
          path: 'list',
          roles: ['links-list'],
          component: QianKunStartScreen
        },
        {
          title: 'qiankun-layout.menu.links.category',
          path: 'category',
          roles: ['links-category'],
          component: QianKunStartScreen
        },
        /*
        {
          hidden: true,
          title: ':chapters*',
          path: '/links/:chapters*',
          component: QianKunStart,
        },
        */
      ]
    },

    {
      icon: 'set',
      title: 'qiankun-layout.menu.system',
      path: '/system',
      redirect: '/system/accountlist',
      roles: ['setting'],
      component: BlankLayout,
      children: [
        {
          title: 'qiankun-layout.menu.system.accountlist',
          path: 'accountlist',
          roles: ['setting-accountlist'],
          component: QianKunStartScreen
        },
        {
          title: 'qiankun-layout.menu.system.rolelist',
          path: 'rolelist',
          roles: ['setting-rolelist'],
          component: QianKunStartScreen
        },
        {
          title: 'qiankun-layout.menu.system.menulist',
          path: 'menulist',
          roles: ['setting-menulist'],
          component: QianKunStartScreen
        },
        {
          title: 'qiankun-layout.menu.system.apilist',
          path: 'apilist',
          roles: ['setting-apilist'],
          component: QianKunStartScreen
        },
        /*
        {
          hidden: true,
          title: ':chapters*',
          path: '/system/:chapters*',
          component: QianKunStart,
        },
        */
      ]
    }
];

export default QiankunLayoutRoutes;
