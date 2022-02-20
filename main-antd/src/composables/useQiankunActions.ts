/**
 * 根据注入的childProjectEntry函数获取对应子项目入口  composables
 * @author LiQingSong
 */
import { inject } from 'vue'
import { MicroAppStateActions  } from 'qiankun'

export default function useQiankunActions(): MicroAppStateActions {
  return inject<MicroAppStateActions>('qiankunActions', {
    onGlobalStateChange: (callback: Function, fireImmediately?: boolean | undefined) => {console.log('undefined')},
    setGlobalState: (state: Record<string, any>) => false,
    offGlobalStateChange: () => false
  })
}
