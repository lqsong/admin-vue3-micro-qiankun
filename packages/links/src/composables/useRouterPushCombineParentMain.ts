import { useRouter, RouteQueryAndHash, MatcherLocationAsPath, RouteLocationOptions, NavigationFailure } from 'vue-router';
import useParentMainRouter from '@/composables/useParentMainRouter';

export declare type RouteLocationRawRest = string | (RouteQueryAndHash & MatcherLocationAsPath & RouteLocationOptions);

 /**
  * router.push 结合判断是否在主框架中，兼容qiankun主框架中运行与当前项目独立运行
  * 定义成返回函数【() => Promise<void | NavigationFailure | undefined>】的原因：
  * 这是由于 vue compostion api 的规则造成的，useRouterPushCombineParentMain必须在setup中第一层级调用，不能嵌套在setup中的其他函数或方法中去调用
  * @param to RouteLocationRawRest
  * @returns
  * @author LiQingSong
  */
 export default function useRouterPushCombineParentMain(to: RouteLocationRawRest): () => Promise<void | NavigationFailure | undefined>{
    const pRouter = useParentMainRouter();
    const router = useRouter();

    // 不在(不存在)主框架中调用
    if(!pRouter) {
        return ()=> router.push(to)
    }

    // 在主框架中调用
    const routerBase = router.options.history.base;
    let newTo: RouteLocationRawRest = to;
    if(typeof newTo === 'string') {
        newTo =  routerBase + to
    } else {
        newTo.path = routerBase + newTo.path;
    }

    return ()=> pRouter.push(newTo)

 }
