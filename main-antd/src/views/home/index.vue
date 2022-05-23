<script lang="ts" setup>
import { ref } from 'vue'
import useQiankunMicroChildEntry from '@/composables/useQiankunMicroChildEntry'
import useQiankunLoadMicroApp from '@/composables/useQiankunLoadMicroApp'

import { useStore } from 'vuex'
import { StateType as GlobalStateType } from "@/store/global"
const store = useStore<{global: GlobalStateType;}>()
store.commit('global/setQiankunViewStyle','none')

const articleChartCardLoading = ref<boolean>(false)
useQiankunLoadMicroApp(
  {
    name: 'home1',
    entry: useQiankunMicroChildEntry('article'),
    container: '#home1',
    data: {
      defaultPath: '/dashboard/analysis/chartcard'
    }
  },
  {},
  {
    beforeLoad: [
      async () => {
        articleChartCardLoading.value = true
      },
    ],
    beforeMount: [
      async () => {
        articleChartCardLoading.value = true
      },
    ],
    afterMount: [
      async () => {
        articleChartCardLoading.value = false
      },
    ],
  }
)

const linksChartCardLoading = ref<boolean>(false)
useQiankunLoadMicroApp(
  {
    name: 'home2',
    entry: useQiankunMicroChildEntry('links'),
    container: '#home2',
    data: {
      defaultPath: '/dashboard/analysis/chartcard'
    }
  },
  {},
  {
    beforeLoad: [
      async () => {
        linksChartCardLoading.value = true
      },
    ],
    beforeMount: [
      async () => {
        linksChartCardLoading.value = true
      },
    ],
    afterMount: [
      async () => {
        linksChartCardLoading.value = false
      },
    ],
  }
)

const articleHitCardLoading = ref<boolean>(false)
useQiankunLoadMicroApp(
  {
    name: 'home3',
    entry: useQiankunMicroChildEntry('article'),
    container: '#home3',
    data: {
      defaultPath: '/dashboard/analysis/hitcard'
    }
  },
  {},
  {
    beforeLoad: [
      async () => {
        articleHitCardLoading.value = true
      },
    ],
    beforeMount: [
      async () => {
        articleHitCardLoading.value = true
      },
    ],
    afterMount: [
      async () => {
        articleHitCardLoading.value = false
      },
    ],
  }
)

const linksHitCardLoading = ref<boolean>(false)
useQiankunLoadMicroApp(
  {
    name: 'home4',
    entry: useQiankunMicroChildEntry('links'),
    container: '#home4',
    data: {
      defaultPath: '/dashboard/analysis/hitcard'
    }
  },
  {},
  {
    beforeLoad: [
      async () => {
        linksHitCardLoading.value = true
      },
    ],
    beforeMount: [
      async () => {
        linksHitCardLoading.value = true
      },
    ],
    afterMount: [
      async () => {
        linksHitCardLoading.value = false
      },
    ],
  }
)

</script>
<template>
  <div class="qiankunlayout-main-conent">


    <a-row :gutter="24">
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a-spin v-if="articleChartCardLoading" size="large" />
        <div id="home1"></div>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a-spin v-if="linksChartCardLoading" size="large" />
        <div id="home2"></div>
      </a-col>
    </a-row>

    <a-row :gutter="24">
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a-spin v-if="articleHitCardLoading" size="large" />
        <div id="home3"></div>
      </a-col>
      <a-col :xs="24" :sm="24" :md="24" :lg="12" :xl="12">
        <a-spin v-if="linksHitCardLoading" size="large" />
        <div id="home4"></div>
      </a-col>
    </a-row>


  </div>
</template>

