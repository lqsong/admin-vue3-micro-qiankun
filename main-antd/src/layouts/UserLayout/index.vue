<template>
    <div class="user-layout">
      <div class="lang">
        <SelectLang />
      </div>
      <router-view></router-view>
    </div>
</template>
<script lang="ts">
import { computed, defineComponent } from "vue";
import { useRoute } from 'vue-router';
import { jsonPathVueRoutes, getJsonRouteItem, RoutesDataItem, PathJsonRoutesDataItem, vueRoutes } from '@/utils/routes';
import UserLayoutRoutes from './routes';
import SelectLang from '@/components/SelectLang/index.vue';
import useTitle from '@/composables/useTitle';

export default defineComponent({
    name: 'UserLayout',
    components: {
        SelectLang
    },
    setup() {
        const route = useRoute();

        // 所有菜单路由
        const menuData: RoutesDataItem[] = vueRoutes(UserLayoutRoutes,'/user');

        // 框架所有的路由转成json并统一添加了parentPath
        const jsonPathRoutes: PathJsonRoutesDataItem = jsonPathVueRoutes(menuData)

        // 当前路由 item
        const routeItem = computed<RoutesDataItem>(()=>getJsonRouteItem(route.path, jsonPathRoutes));

        // 设置title
        useTitle(routeItem);

    }
})
</script>
<style lang="less" scoped>
.user-layout {
  display: flex;
  width: 100%;
  height: 100vh;
  min-height: 500px;
  overflow: auto;
  background-image: url('../../assets/images/bg.svg');
  background-repeat: no-repeat;
  background-position: center center;
  background-attachment: fixed;
  background-size: cover;
  align-items: center;
  .lang {
    position: absolute;
    top: 20px;
    right: 50px;
    color: #ffffff;
    font-size: 16px;


    ::v-deep(.dropDown) {
        i,
        .svg-icon {
            color: rgba(0,0,0,.85);
            font-size: 16px;
        }
    }


  }
}
</style>
