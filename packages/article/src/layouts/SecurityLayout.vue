<template>
    <el-result v-if="!isLogin" >
      <template #icon>
        <spin style="height: 200px;"/>
      </template>
      <template #extra>
        <!-- <el-button type="primary">Go Login</el-button> -->
      </template>
    </el-result>
    <router-view v-if="isLogin" />
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import Spin from '@/components/Spin/index.vue';
import { StateType as UserStateType, CurrentUser } from "@/store/user";


const store = useStore<{user: UserStateType}>();

// 获取当前登录用户信息
const currentUser = computed<CurrentUser>(()=> store.state.user.currentUser);

// 判断是否登录
const isLogin = computed<boolean>(()=> currentUser.value ? currentUser.value.id > 0 : false);


</script>
