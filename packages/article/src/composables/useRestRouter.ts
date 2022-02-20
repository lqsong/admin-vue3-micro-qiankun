
/**
 * 根据注入的parentRouter获取Router,如果主框架存在是parentRouter不存在是自己的router  composables
 * @author LiQingSong
 */
 import { inject } from 'vue'
 import { Router, useRouter } from 'vue-router'

export default function useRestRouter(): Router {
  const router: Router = inject<Router>('parentRouter', useRouter())
  return router
}
