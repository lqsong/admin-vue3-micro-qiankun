import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { ResponseData } from '@/utils/request';
import { queryCurrent, queryMessage } from "@/services/user";
import { removeToken } from "@/utils/localToken";
import useQiankunActions from "@/composables/useQiankunActions";

export interface CurrentUser {
  id: number;
  name: string;
  avatar: string;
  roles: string[];
}

export interface StateType {
  currentUser: CurrentUser;
  message: number;
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    saveCurrentUser: Mutation<StateType>;
    saveMessage: Mutation<StateType>;
  };
  actions: {
    fetchCurrent: Action<StateType, StateType>;
    fetchMessage: Action<StateType, StateType>;
    logout: Action<StateType, StateType>;
  };
}

const initState: StateType = {
  currentUser: {
    id: 0,
    name: '',
    avatar: '',
    roles: [],
  },
  message: 0,
}

const StoreModel: ModuleType = {
  namespaced: true,
  name: 'user',
  state: {
    ...initState
  },
  mutations: {
    saveCurrentUser(state, payload) {
      state.currentUser = {
        ...initState.currentUser,
        ...payload,
      }
      const actions = useQiankunActions();
      actions.setGlobalState({currentUser: {...state.currentUser}})
    },
    saveMessage(state, payload) {
      state.message = payload;
    }
  },
  actions: {
    async fetchCurrent({ commit }) {
      try {
        const response: ResponseData = await queryCurrent();
        const { data } = response;

        /* lqsblog - 重置返回的数据 S */
        const auth = data.resources || [];
        data.resources = data.roles || [];
        data.roles = auth;
        /* lqsblog - 重置返回的数据 $ */

        commit('saveCurrentUser', data || {});
        return true;
      } catch (error) {
        return false;
      }
    },
    async fetchMessage({ commit }) {
      try {
        const response: ResponseData = await queryMessage();
        const { data } = response;
        commit('saveMessage', data || 0);
        return true;
      } catch (error) {
        return false;
      }
    },
    async logout({ commit }) {
      try {
        await removeToken();
        commit('saveCurrentUser', { ...initState.currentUser });
        return true;
      } catch (error) {
        return false;
      }
    }
  }
}



export default StoreModel;
