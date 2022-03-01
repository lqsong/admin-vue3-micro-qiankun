<template>
    <div class="main">
        <h1 class="title">
            {{t('page.user.login.form.title')}}
        </h1>
        <el-form :model="modelRef" :rules="rulesRef" ref="formRef">
            <el-form-item  label="" prop="username">
                <el-input v-model="modelRef.username" :placeholder="t('page.user.login.form-item-username')" @keydown.enter="handleSubmit">
                    <template #prefix>
                        <i class="el-input__icon">
                            <icon-svg type="user"></icon-svg>
                        </i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item label="" prop="password">
                <el-input v-model="modelRef.password" type="password" :placeholder="t('page.user.login.form-item-password')" @keydown.enter="handleSubmit">
                    <template #prefix>
                         <i class="el-input__icon">
                            <icon-svg type="pwd"></icon-svg>
                        </i>
                    </template>
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" class="submit" @click="handleSubmit" :loading="submitLoading">
                    {{t('page.user.login.form.btn-submit')}}
                </el-button>
                <div class="text-align-right">
                    <router-link to="/user/register">
                        {{t('page.user.login.form.btn-jump')}}
                    </router-link>
                </div>
            </el-form-item>

            <el-alert v-if="loginStatus === 'error' && !submitLoading" :title="t('page.user.login.form.login-error')" type="error" show-icon :closable="false" />

        </el-form>
    </div>
</template>
<script lang="ts" setup>
import { computed, reactive, ref } from "vue";
import { useRouter } from 'vue-router';
import { useStore } from 'vuex';
import { useI18n } from "vue-i18n";
import { ElForm, ElMessage } from 'element-plus';
import IconSvg from "@/components/IconSvg";
import { LoginParamsType } from './data.d';
import { StateType as UserLoginStateType } from './store';


const router = useRouter();
const { currentRoute } = router;
const store = useStore<{userlogin: UserLoginStateType}>();
const { t } = useI18n();


// 表单值
const modelRef = reactive<LoginParamsType>({
    username: '',
    password: ''
});
// 表单验证
const rulesRef = reactive({
    username: [
        {
            required: true,
            message: t('page.user.login.form-item-username.required'),
        },
    ],
    password: [
        {
            required: true,
            message: t('page.user.login.form-item-password.required'),
        },
    ],
});
// form
const formRef = ref<typeof ElForm>();
// 登录loading
const submitLoading = ref<boolean>(false);
// 登录
const handleSubmit = async () => {
    submitLoading.value = true;
    try {
        const valid: boolean | undefined =  await formRef.value?.validate();
        if(valid === true) {
            const res: boolean = await store.dispatch('userlogin/login',modelRef);
            if (res === true) {
                ElMessage.success(t('page.user.login.form.login-success'));
                const { redirect, ...query } = currentRoute.value.query;
                window.location.href = router.resolve({
                    path: redirect as string || '/',
                    query: {
                        ...query
                    }
                }).href;
            }
        }
    } catch (error) {
        // console.log(error);
        ElMessage.warning(t('app.global.form.validatefields.catch'));
    }
    submitLoading.value = false;
}

// 登录状态
const loginStatus = computed<"ok" | "error" | undefined>(()=> store.state.userlogin.loginStatus);

</script>
<style lang="scss" scoped>
.main {
  flex: none;
  width: 248px;
  padding: 36px;
  margin: 0 auto;
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 0 10px rgba(0,0,0,.1);
  .title {
    font-size: 28px;
    margin-top: 0;
    margin-bottom: 30px;
    text-align: center;
    color: rgba(0,0,0,.85);
   /*background-image:-webkit-linear-gradient(right,#FFFFFF,#409eff, #FFFFFF);
    -webkit-background-clip: text;
    -webkit-text-fill-color:transparent; */
  }
  .submit {
    width: 100%;
  }
}

</style>
