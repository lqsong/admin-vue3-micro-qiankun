
/**
 * 获取注入的parentRouter,如果qiankun主框架存在则存在否则undefined  composables
 * 主框架router
 * @author LiQingSong
 */
 import { inject } from 'vue'
 import { Router } from 'vue-router'

export default function useParentMainRouter(): Router | undefined {
  return inject<Router>('parentRouter')
}
