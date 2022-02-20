
import { Mutation/* , Action */ } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { TabNavItem, equalTabNavRoute } from '@/utils/routes';
import settings, { Theme, NavMode } from '@/config/settings';
import router from '@/config/routes';

export interface StateType {
  // 左侧展开收起
  collapsed: boolean;
  // 模板主题
  theme: Theme;
  // 头部固定开启
  navMode: NavMode;
  // 头部固定开启
  headFixed: boolean;
  // tab菜单开启
  tabNavEnable: boolean;
  // 头部tab导航列表
  headTabNavList: TabNavItem[];
  // 左侧侧边固定开启
  leftSiderFixed: boolean;
  // qiankun.js startLoading
  qiankunStartLoading: boolean;
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    changeLayoutCollapsed: Mutation<StateType>;
    setTheme: Mutation<StateType>;
    setNavMode: Mutation<StateType>;
    setHeadFixed: Mutation<StateType>;
    setTabNavEnable: Mutation<StateType>;
    setHeadTabNavList: Mutation<StateType>;
    closeCurrentHeadTabNav: Mutation<StateType>;
    setLeftSiderFixed: Mutation<StateType>;
    setQiankunStartLoading: Mutation<StateType>;
  };
  actions: {
  };
}

const homeRoute = router.resolve(settings.homeRouteItem.path);
const initState: StateType = {
  collapsed: false,
  theme: settings.theme,
  navMode: settings.navMode,
  headFixed: settings.headFixed,
  tabNavEnable: settings.tabNavEnable,
  headTabNavList: [
    {
      route: homeRoute,
      menu: settings.homeRouteItem
    }
  ],
  leftSiderFixed: settings.leftSiderFixed,
  qiankunStartLoading: false
};

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'global',
  state: {
    ...initState
  },
  mutations: {
    changeLayoutCollapsed(state, payload) {
      state.collapsed = payload;
    },
    setTheme(state, payload) {
      state.theme = payload;
    },
    setNavMode(state, payload) {
      state.navMode = payload;
    },
    setHeadFixed(state, payload) {
      state.headFixed = payload;
    },
    setTabNavEnable(state, payload) {
      state.tabNavEnable = payload;
    },
    setHeadTabNavList(state, payload) {
      state.headTabNavList = payload;
    },
    /**
     * 关闭当前tabNav，并调转自定义路由
     * @param state
     * @param payload Function 回调
     */
    closeCurrentHeadTabNav(state, payload: Function) {
      const navList: TabNavItem[] =  state.headTabNavList.filter((item2: TabNavItem) => !equalTabNavRoute(router.currentRoute.value, item2.route, item2.menu.tabNavType))
      state.headTabNavList = [
        ...navList
      ]
      if(typeof payload === 'function') {
        payload()
      }
    },
    setLeftSiderFixed(state, payload) {
      state.leftSiderFixed = payload;
    },
    setQiankunStartLoading(state, payload) {
      state.qiankunStartLoading = payload;
    },
  },
  actions: {}
}



export default StoreModel;
