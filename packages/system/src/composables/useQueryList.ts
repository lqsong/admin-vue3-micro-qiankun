import { computed, onMounted, watch, ComputedRef } from 'vue';
import { useRouter } from 'vue-router';
import useParentMainRouter from '@/composables/useParentMainRouter';

export interface QueryParams {
    page: number;
    per: number;
}

export type PushQuery<T> = (param: Partial<T>) => void;

export interface Response<T> {
    queryParams: ComputedRef<T>;
    pushQuery: PushQuery<T>;
}


/**
 * 查询列表并根据route监听  composables
 * @param verifyRoutePath 验证的路由path
 * @param cb 回调函数
 * @returns {跳转函数}
 * @author LiQingSong
 */
 export default function useQueryList<T extends QueryParams>(verifyRoutePath: string, cb: (queryParams: T, pushQuery: PushQuery<T>) => any): Response<T> {
    const pRouter = useParentMainRouter();
    const router = useRouter();

    // route query参数
    const queryParams = computed<T>(()=> {
        const { per = 20, page=1 , ...other } = router.currentRoute.value.query;
        return { per: Number(per), page: Number(page), ...other} as T;
    })

    /**
     * query跳转
     * @param param 需要调转的参数，比如页码
     */
    const pushQuery = (param: Partial<T>): void => {
      if(!pRouter) {
        // 不在(不存在)主框架中调用
        router.push({
            ...router.currentRoute.value,
            query: {
                ...router.currentRoute.value.query,
                ...param
            }
        })
      } else {
        const baseLen = pRouter.options.history.base.length;
        const pHref = router.resolve({
            ...router.currentRoute.value,
            query: {
                ...router.currentRoute.value.query,
                ...param
            }
        }).href.substring(baseLen);
        pRouter.push(pHref)
      }
    }


    const verify = () => {
        if(router.currentRoute.value.path !== verifyRoutePath) {
           return false;
        }
        cb(queryParams.value, pushQuery)
    }

     watch<T>(queryParams,() => {
        verify();
     })

     onMounted(()=> {
        verify();
     })

     return {
        queryParams,
        pushQuery
     }

 }
