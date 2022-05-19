import { initGlobalState, MicroAppStateActions  } from 'qiankun'

export const initState = {
  i18nLocale: '',
  currentUser: {
    id: 0,
    name: '',
    avatar: '',
    roles: [],
  }
}

// 初始化 state
export const actions: MicroAppStateActions  = initGlobalState(initState)
