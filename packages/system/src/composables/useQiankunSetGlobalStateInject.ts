
/**
 * 根据注入的qiankunSetGlobalState获取qiankun全局状态设置函数SetGlobalState  composables
 * @author LiQingSong
 */
 import { inject } from 'vue'

 export default function useQiankunSetGlobalStateInject(): (state: Record<string, any>) => boolean {
    const dFun = (state: Record<string, any>): boolean => false
    const f = inject('qiankunSetGlobalState', dFun);

    // inject 传的值有可能是 undefined , 比如子项目单独运行
    if(!f) {
        return dFun;
    }

    return f;
 }
 