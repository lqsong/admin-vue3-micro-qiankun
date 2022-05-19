import { Router } from 'vue-router';
import { Store } from "vuex";

/**
 * 导出qiankuan方法及自定义方法等等
 */
export * from "../../scripts/server/qiankun";


// 主应用需要传递给微应用的数据Props Data ts类型定义
export interface MainPropsData {
    defaultPath?: string; // 子应用默认选中的路由path
}

// 主应用需要传递给微应用的数据Props ts类型定义
export interface MainProps {
    parentRouter: Router; // 主框架路由
    closeCurrentHeadTabNav: (fun: Function) => void; // 关闭主框架tabNav，并调用回调函数
    routerHistory: string; // 子应用路由类型
    data: MainPropsData;
}

/**
 * 返回主框架qiankun.js props 主应用需要传递给微应用的数据
 * @param router Router 主框架路由
 * @param store Store 主框架vuex
 * @param data MainPropsData 主框架传给子应用的数据data
 * @param routerHistory string 子应用路由类型
 * @returns 
 */
export const mainProps = <ST>(router: Router, store: Store<ST>, data: MainPropsData = {}, routerHistory = ''): MainProps => {
    return {
        parentRouter: router, 
        closeCurrentHeadTabNav: (fun: Function): void => {
            store.commit('global/closeCurrentHeadTabNav',fun);
        },
        routerHistory,
        data: {
            defaultPath: '',
            ...data
        },
        
    }
}