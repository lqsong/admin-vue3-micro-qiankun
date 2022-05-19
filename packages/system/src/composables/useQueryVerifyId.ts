import { ComputedRef, computed, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { ElMessage } from "element-plus";
import useRouterPushCombineParentMain from '@/composables/useRouterPushCombineParentMain';
import useParentMainCloseCurrentHeadTabNav from '@/composables/useParentMainCloseCurrentHeadTabNav';

 /**
  * 返回 route query id，并验证  composables
  * @param verifyRoutePath 验证的路由path
  * @param cb 回调函数
  * @returns
  * @author LiQingSong
  */
 export default function useQueryVerifyId(verifyRoutePath: string, cb: (id: number) => any): ComputedRef<number> {    
    const route = useRoute();

    const parentMainCloseCurrentHeadTabNav = useParentMainCloseCurrentHeadTabNav();    
    const homeJumpFun = useRouterPushCombineParentMain('/'); // 首页跳转函数

    const id = computed<number>(() => Number(route.query.id || 0))
    const verifyId = () => {
      if(route.path !== verifyRoutePath) {
         return false;
      }

      if(id.value < 1) {
        ElMessage({ message: '参数出错', type: 'error' });
        parentMainCloseCurrentHeadTabNav(() => {
          homeJumpFun()// 跳转首页执行
        })
        return false;
      }

      cb(id.value)

    }


    onMounted(()=> {
       verifyId();
    })

    watch(id,() => {
        verifyId();
    })



    return id;

 }
