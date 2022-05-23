<script lang="ts" setup>
import { useStore } from 'vuex'
import { StateType as GlobalStateType } from "@/store/global"
const store = useStore<{global: GlobalStateType;}>()
store.commit('global/setQiankunViewStyle','');
</script>
<template>
<div style="display: none;"></div>
</template>