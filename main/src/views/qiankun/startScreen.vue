<script lang="ts">
declare global {
  interface Window {
    __QIANKUN_STARTED__: boolean;
  }
}
export default {}
</script>
<script lang="ts" setup>
import { start } from 'qiankun'
import { onMounted, computed } from "vue"
import { useStore } from 'vuex'
import { StateType as GlobalStateType } from '@/store/global'
import Spin from '@/components/Spin/index.vue'

const store = useStore<{global: GlobalStateType;}>()

const qiankunStartLoading = computed(()=> store.state.global.qiankunStartLoading)

onMounted(()=> {
  if (!window.__QIANKUN_STARTED__) {
    window.__QIANKUN_STARTED__ = true;
    start();
  }

})
</script>
<template>
  <div v-if="qiankunStartLoading" class="qiankunlayout-main-conent-screen-loading">
    <spin/>
  </div>
  <div id="subapp-viewport" class="qiankunlayout-main-conent-screen"></div>
</template>
<style lang="scss">
.qiankunlayout-main-conent-screen-loading {
  position: absolute;
  padding-top: 100px;
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
}
.qiankunlayout-main-conent-screen {
  height: calc(100% - 32px);
  &>div:first-child {
    height: 100%;
    #app {
      height: 100%;
    }
  }
}
</style>
