 import { ComputedRef, computed, onMounted, watch } from 'vue';
 import { useRoute } from 'vue-router';
 import useRestRouter from '@/composables/useRestRouter';
 import useRestStore from '@/composables/useRestStore';
 import { ElMessage } from "element-plus";

 /**
  * 返回 route query id，并验证  composables
  * @param verifyRoutePath 验证的路由path
  * @param cb 回调函数
  * @returns
  * @author LiQingSong
  */
 export default function useQueryVerifyId(verifyRoutePath: string, cb: (id: number) => any): ComputedRef<number> {
    const store = useRestStore();
    const route = useRoute();
    const restRouter = useRestRouter();
    const id = computed<number>(() => Number(route.query.id || 0))

    const verifyId = () => {
      if(route.path !== verifyRoutePath) {
         return false;
      }

      if(id.value < 1) {
        ElMessage({ message: '参数出错', type: 'error' });
        store.commit('global/closeCurrentHeadTabNav',() => {
          restRouter.push('/')
        });
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
