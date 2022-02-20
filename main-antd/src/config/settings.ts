import { RoutesDataItem } from "@/utils/routes";

export type Theme = 'dark' | 'light';

export type NavMode = 'inline' | 'horizontal';

/**
 * 站点配置
 * @author LiQingSong
 */
export interface SettingsType {
    /**
     * 站点名称
     */
    siteTitle: string;

    /**
     * 模板主题
     */
    theme: Theme;

    /**
     * 导航模式
     */
    navMode: NavMode;

    /**
     * 头部固定开启
     */
    headFixed: boolean;

    /**
     * tab菜单开启
     */
    tabNavEnable: boolean;

    /**
     * 左侧侧边固定开启
     */
    leftSiderFixed: boolean;

     /**
     * 站点首页路由
     */
    homeRouteItem: RoutesDataItem;

    /**
     * 站点本地存储Token 的 Key值
     */
    siteTokenKey: string;

    /**
     * Ajax请求头发送Token 的 Key值
     */
    ajaxHeadersTokenKey: string;

    /**
     * Ajax返回值不参加统一验证的api地址
     */
    ajaxResponseNoVerifyUrl: string[];

    /**
     * iconfont.cn 项目在线生成的 js 地址
     */
    iconfontUrl: string[];
}

const settings: SettingsType = {
  siteTitle: 'ADMIN-VUE3-MICRO',
  theme: 'dark',
  navMode: 'inline',
  headFixed: true,
  tabNavEnable: true,
  leftSiderFixed: true,
  homeRouteItem: {
      icon: 'home',
      title: 'qiankun-layout.menu.home',
      path: '/home',
      component: ()=> import('@/views/home/index.vue')
  },
  siteTokenKey: 'admin_vue_micro_token',
  ajaxHeadersTokenKey: 'x-token',
  ajaxResponseNoVerifyUrl: [
      '/user/login', // 用户登录
      '/user/info', // 获取用户信息
  ],
  iconfontUrl: [],
};

export default settings;
