<template>
  <div class="layout-main-conent">
    <permission :roles="routeItem.roles">
      <router-view></router-view>
    </permission>
  </div>
</template>
<script lang="ts" setup>
import { computed } from "vue"
import { useRoute } from 'vue-router'
import { RoutesDataItem, PathJsonRoutesDataItem, vueRoutes, jsonPathVueRoutes, getJsonRouteItem } from '@/utils/routes'
import Permission from '@/components/Permission/index.vue'
import LayoutRoutes from './routes'

const route = useRoute()

// 框架所有菜单路由
const menuData: RoutesDataItem[] = vueRoutes(LayoutRoutes)

// 框架所有的路由转成json并统一添加了parentPath
const jsonPathRoutes: PathJsonRoutesDataItem = jsonPathVueRoutes(menuData)

// 当前路由 item
const routeItem = computed<RoutesDataItem>(()=> getJsonRouteItem(route.path, jsonPathRoutes))

</script>
<style lang="scss" scoped>
.layout-main-conent {
  padding: 24px;
  position: relative;
  height: 100%;
  overflow: hidden;
  box-sizing: border-box;
  background-color: #f0f3f4;
}
</style>
