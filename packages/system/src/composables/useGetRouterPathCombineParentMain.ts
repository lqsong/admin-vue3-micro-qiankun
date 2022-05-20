import { useRouter, Router } from 'vue-router';
import useParentMainRouter from '@/composables/useParentMainRouter';

export interface RouterPath {
    isMain: boolean; // 是否在主框架中调用
    router: Router;
    path: string;
}

 /**
  * 结合判断是否在主框架中返回 RouterPath
  * 由于 vue compostion api 的规则，useGetRouterPathCombineParentMain必须在setup中第一层级调用，不能嵌套在setup中的其他函数或方法中去调用
  * @param path string
  * @returns 
  * @author LiQingSong
  */
 export default function useGetRouterPathCombineParentMain(path: string): RouterPath{
    const pRouter = useParentMainRouter();
    const router = useRouter();

    // 不在(不存在)主框架中调用
    if(!pRouter) {
        return {
            isMain: false,
            router,
            path
        }
    }

    // 在主框架中调用
    const routerBase = router.options.history.base;
    return {
        isMain: true,
        router: pRouter,
        path: routerBase + path
    }

 }
