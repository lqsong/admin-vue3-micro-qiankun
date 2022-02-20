
/**
 * 根据注入的parentStore获取Store,如果主框架存在是parentStore不存在是自己的Store  composables
 * @author LiQingSong
 */
 import { inject } from 'vue'
 import { Store, useStore } from 'vuex'

export default function useRestStore(): Store<any> {
  const store: Store<any> = inject<Store<any>>('parentStore', useStore())
  return store
}
