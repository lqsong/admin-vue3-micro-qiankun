/**
 * 手动局部加载microApp  composables
 * @author LiQingSong
 */
import { loadMicroApp, MicroApp, FrameworkConfiguration, FrameworkLifeCycles } from 'qiankun'
import { onMounted, onUnmounted } from "vue"
import router from '@/config/routes'
import store from '@/config/store'

export interface Props {
    name: string;
    entry: string;
    container: string;
    routerHistory?: string
    data?: {[key:string]:any};
}

export default function useLoadMicroApp(props: Props, configuration?: FrameworkConfiguration & {
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
                routerHistory,
                parentRouter: router,
                parentStore: store,
                data: {
                    defaultPath: '',
                    ...data
                }
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
