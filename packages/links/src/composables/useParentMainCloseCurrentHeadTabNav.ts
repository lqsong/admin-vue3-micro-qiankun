
/**
 * 获取注入的parentCloseCurrentHeadTabNav,如果qiankun主框架存在则存在此方法否则自定义补全  composables
 * 关闭主框架当前tabNav，并调用回调函数
 * @author LiQingSong
 */
import { inject } from 'vue'

export default function useParentMainCloseCurrentHeadTabNav(): (fun: Function) => void {
    const dFun =  (fun: Function): void => {
        if(typeof fun === 'function') {
            fun()
        }
    };
    const f =  inject('parentCloseCurrentHeadTabNav', dFun);

    // inject 传的值有可能是 undefined , 比如子项目单独运行
    if(!f) {
        return dFun;
    }

    return f;   
}
