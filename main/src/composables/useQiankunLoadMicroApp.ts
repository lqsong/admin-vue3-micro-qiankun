/**
 * 手动局部加载microApp  composables
 * @author LiQingSong
 */
import { onMounted, onUnmounted } from "vue";
import router from "@/config/routes";
import store from '@/config/store';
import { loadMicroApp, MicroApp, FrameworkConfiguration, FrameworkLifeCycles, mainProps, MainPropsData } from "@/qiankun";

export interface Props {
    name: string;
    entry: string;
    container: string;
    routerHistory?: string
    data?: MainPropsData;
}

export default function useQiankunLoadMicroApp(props: Props, configuration?: FrameworkConfiguration & {
  autoStart?: boolean;
}, lifeCycles?: FrameworkLifeCycles<any>): void {

    const { name, entry, container, data= {}, routerHistory= 'memory' } = props

    let microApp:MicroApp

    onMounted(()=> {
        microApp = loadMicroApp(
          {
            name,
            entry,
            container,
            props: {
              ...mainProps(router, store, data, routerHistory)
            },
          },
          configuration,
          lifeCycles
        );

    })


    onUnmounted(()=> {
        microApp.unmount()
    })

 }
