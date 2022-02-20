import { Mutation, Action } from 'vuex';
import { StoreModuleType } from "@/utils/store";
import { removeToken } from "@/utils/localToken";

export interface CurrentUser {
  id: number;
  name: string;
  avatar: string;
  roles: string[];
}

export interface StateType {
  currentUser: CurrentUser;
}

export interface ModuleType extends StoreModuleType<StateType> {
  state: StateType;
  mutations: {
    saveCurrentUser: Mutation<StateType>;
  };
  actions: {
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
    },
  },
  actions: {
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
