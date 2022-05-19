<template>
    <a-result v-if="!isLogin">
        <template #icon>
            <a-spin size="large" />
        </template>
    </a-result>
    <router-view v-if="isLogin" />
</template>
<script lang="ts" setup>
import { computed } from "vue";
import { useStore } from "vuex";
import { StateType as UserStateType, CurrentUser } from "@/store/user";
const store = useStore<{user: UserStateType}>();

// 获取当前登录用户信息
const currentUser = computed<CurrentUser>(()=> store.state.user.currentUser);

// 判断是否登录
const isLogin = computed<boolean>(()=> currentUser.value ? currentUser.value.id > 0 : false);

/* 为开发环境设置 */
if(process.env.NODE_ENV==='development' && store.state.user.currentUser.id < 1) {
   store.commit('user/saveCurrentUser', {
     ...store.state.user.currentUser,
     id: 1,
     name: 'admin',
     roles: ['admin']
   });
}
</script>
