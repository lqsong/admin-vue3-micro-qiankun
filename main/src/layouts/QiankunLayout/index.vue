<script lang="ts">
declare global {
  interface Window {
    __QIANKUN_STARTED__: boolean;
  }
}
export default {}
</script>
<script lang="ts" setup>
import { computed, onMounted } from "vue"
import { useStore } from 'vuex'
import { useRoute } from 'vue-router'
import { StateType as GlobalStateType } from '@/store/global'
import { RoutesDataItem, BreadcrumbType, PathJsonRoutesDataItem, vueRoutes, jsonPathVueRoutes, getJsonRouteItem, getBreadcrumbRoutes } from '@/utils/routes'
import useTitle from '@/composables/useTitle'
import Permission from '@/components/Permission/index.vue'
import LeftSider from "./components/LeftSider.vue"
import RightTop from './components/RightTop.vue'
import RightFooter from './components/RightFooter.vue'
import LayoutRoutes from './routes'
import useQiankunStart from "@/composables/useQiankunStart"
import Spin from '@/components/Spin/index.vue'


const store = useStore<{global: GlobalStateType;}>()
const route = useRoute()

// 模板主题
const theme = computed(()=> store.state.global.theme)

// 导航模式
const navMode = computed(()=> store.state.global.navMode)

// 框架所有菜单路由
const menuData: RoutesDataItem[] = vueRoutes(LayoutRoutes)

// 框架所有的路由转成json并统一添加了parentPath
const jsonPathRoutes: PathJsonRoutesDataItem = jsonPathVueRoutes(menuData)

// 当前路由 item
const routeItem = computed<RoutesDataItem>(()=> getJsonRouteItem(route.path, jsonPathRoutes))

// 面包屑导航
const breadCrumbs = computed<BreadcrumbType[]>(() => getBreadcrumbRoutes(route.path, jsonPathRoutes))

// 设置title
useTitle(routeItem);

//qiankun.js loading
const qiankunStartLoading = computed(()=> store.state.global.qiankunStartLoading)
const qiankunViewStyle = computed(()=>store.state.global.qiankunViewStyle);
// qiankun.js  执行start
onMounted(()=> {
  if (!window.__QIANKUN_STARTED__) {
    window.__QIANKUN_STARTED__ = true;
    useQiankunStart();
  }
})
</script>
<template>
    <div id="qiankunlayout" :class="{'light': theme === 'light'}">
      <left-sider
        v-if="navMode==='vertical'"
        :menu-data="menuData"
        :route-item="routeItem">
      </left-sider>
      <div id="qiankunlayout-right">
        <right-top
         :menu-data="menuData"
         :route-item="routeItem"
         :bread-crumbs="breadCrumbs">
        </right-top>
        <div id="qiankunlayout-right-main">
          <permission :roles="routeItem.roles">
            <div v-if="qiankunStartLoading" class="qiankunlayout-main-conent-loading">
              <spin/>
            </div>
            <!-- qiankun subapp-viewport-->
            <div 
              id="subapp-viewport" 
              :class="{
                'qiankunlayout-main-conent-screen': qiankunViewStyle === 'screen',
                'qiankunlayout-main-conent-none': qiankunViewStyle === 'none'
              }">
            </div>
            <router-view></router-view>
          </permission>
          <right-footer></right-footer>
        </div>
      </div>
    </div>
</template>
<style lang="scss">
@import './css/index.scss';
</style>
