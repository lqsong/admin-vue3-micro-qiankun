<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: 'FormDialog',
})
</script>
<script lang="ts" setup>
    import RoleSelect from '@/components/Custom/RoleSelect/index.vue';
    import { OptionItem } from '@/components/Custom/RoleSelect/data.d';
    import { reactive, ref, computed, defineProps, defineEmits, withDefaults, defineExpose } from "vue";
    import { useI18n } from "vue-i18n";
    import { ElForm, ElMessage } from "element-plus";
    import { Account, DataItem, FormItem } from "./data.d";

    interface Props {
        modelValue: boolean;
        submitLoading?: boolean;
        values?: Account;
        title?: string;
        onSubmit: (values: DataItem) => Promise<void>;
    }

    const props = withDefaults(defineProps<Props>(), {
        submitLoading: false,
        title: 'Form',
    })


    const { t } = useI18n();


    const emit = defineEmits(['update:modelValue','update:submitLoading'])
    const visible = computed<boolean>({
        get: () => props.modelValue,
        set: val => {
            emit('update:modelValue', val);
        }
    });
    const submitLoading = computed<boolean>({
        get: () => props.submitLoading,
        set: val => {
            emit('update:submitLoading', val);
        }
    });

    const defaultValues: Account = props.values || {
        id: 0,
        nickname: '',
        username: '',
        password: '',
        roles: []
    };

    const roleSelectDefaultOption = computed<OptionItem[]>(()=> {
        const val: OptionItem[] = [];
        if(props.values) {
            props.values.roles.map(item=> {
                val.push({
                    value: item.id,
                    label: item.name
                })
            })
        }

        return val;
    })


    // 表单值
    const modelRef = reactive<FormItem>({
        nickname: defaultValues.nickname || '',
        username:  defaultValues.username || '',
        password: '',
        roles: defaultValues.roles.map(item=> {
            return item.id;
        })
    });
    // 表单验证
    const rulesRef = reactive({
        nickname: [
            { required: true, message: t('views.system.accountlist.components.formdialog.nickname.placeholder'), trigger: 'blur' },
            { max: 8, message: t('views.system.accountlist.components.formdialog.nickname.max'), trigger: 'blur' }
        ],
        username: [
            {
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.system.accountlist.components.formdialog.username.placeholder')));
                    } else if (!/^[a-z0-9]+$/.test(value)) {
                        callback(new Error(t('views.system.accountlist.components.formdialog.username.test')));
                    } else if (value.length < 6 || value.length > 16) {
                        callback(new Error(t('views.system.accountlist.components.formdialog.username.minmax')));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur'
            }
        ],
        password: [
            {
                validator: (rule, value, callback) => {
                    console.log('password', value)
                    if (value === '') {
                        if(defaultValues.id > 0) { // 说明是编辑
                            callback();
                        } else { // 添加
                            callback(new Error(t('views.system.accountlist.components.formdialog.password.placeholder')));
                        }

                    } else if (!/^[A-Za-z0-9.]+$/.test(value)) {
                        callback(new Error(t('views.system.accountlist.components.formdialog.password.test')));
                    } else if (value.length < 6  || value.length > 16) {
                        callback(new Error(t('views.system.accountlist.components.formdialog.password.minmax')));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur'
            }
        ]
    });
    // form
    const formRef = ref<typeof ElForm>();
    // submit
    const handleSubmit = async (): Promise<void> => {

        submitLoading.value = true;
        try {
            const valid: boolean | undefined =  await formRef.value?.validate();
            if(valid === true) {
                await props.onSubmit(modelRef);
            }
        } catch (error) {
            // console.log(error);
            ElMessage.warning(t('app.global.form.validatefields.catch'));
        }
        submitLoading.value = false;
    }




</script>
<template>
    <el-dialog
            :title="props.title"
            width="500px"
            :close-on-click-modal="false"
            v-model="visible">

                <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="130px" >
                    <el-form-item :label="t('views.system.accountlist.components.formdialog.nickname')" prop="nickname">
                        <el-input v-model.trim="modelRef.nickname" :placeholder="t('views.system.accountlist.components.formdialog.nickname.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.system.accountlist.components.formdialog.username')" prop="username">
                        <el-input v-model.trim="modelRef.username" :placeholder="t('views.system.accountlist.components.formdialog.username.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.system.accountlist.components.formdialog.password')" :required="defaultValues.id < 1">
                        <el-form-item prop="password">
                            <el-input v-model.trim="modelRef.password" :placeholder="defaultValues.id < 1?t('views.system.accountlist.components.formdialog.password.placeholder'):t('views.system.accountlist.components.formdialog.password.placeholder2')" class="width-200"></el-input>
                        </el-form-item>
                    </el-form-item>
                    <el-form-item :label="t('views.system.accountlist.components.formdialog.roles')" prop="roles">
                        <role-select
                            v-model="modelRef.roles"
                            :default-options="roleSelectDefaultOption"
                            multiple
                            :placeholder="t('views.system.accountlist.components.formdialog.roles.placeholder')"
                            class="width-200">
                        </role-select>
                    </el-form-item>
                </el-form>

            <template  #footer>
                <el-button @click="visible=false">{{t('views.system.accountlist.components.formdialog.btn.cancel')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{t('views.system.accountlist.components.formdialog.btn.save')}}</el-button>
            </template>
        </el-dialog>
</template>
