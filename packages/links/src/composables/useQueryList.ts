import { computed, onMounted, watch, ComputedRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';

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
 * @param cb 回调函数
 * @returns {跳转函数}
 * @author LiQingSong
 */
 export default function useQueryList<T extends QueryParams>(cb: (queryParams: T, pushQuery: PushQuery<T>) => any): Response<T> {

    const router = useRouter();
    const route = useRoute();    

    // route query参数
    const queryParams = computed<T>(()=> {
        const { per = 20, page=1 , ...other } = route.query;
        return { per: Number(per), page: Number(page), ...other} as T;
    })

    /**
     * query跳转 
     * @param param 需要调转的参数，比如页码
     */
    const pushQuery = (param: Partial<T>): void => {
        router.push({
            ...route,
            query: {
                ...route.query,
                ...param
            }
        })
    }
     
 
     watch<T>(queryParams,() => {
        cb(queryParams.value, pushQuery)
     })
 
     onMounted(()=> {
        cb(queryParams.value, pushQuery)
     })

     return {
        queryParams,
        pushQuery
     }
 
 }