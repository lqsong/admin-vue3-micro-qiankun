import { Mutation /*, Action*/  } from 'vuex';
import { StoreModuleType } from "@/utils/store";



export interface StateType {}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    closeCurrentHeadTabNav: Mutation<StateType>;
  };
  actions: {
  };
}

const initState: StateType = {
};

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'global',
  state: {
    ...initState
  },
  mutations: {
    /**
     * 定义与父框架相同的关闭当前tabNav，做漏斗
     * @param state
     * @param payload Function 回调
     */
     closeCurrentHeadTabNav(state, payload: Function) {
      if(typeof payload === 'function') {
        payload()
      }
    },
  },
  actions: {}
}



export default StoreModel;
