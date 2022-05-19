<script lang="ts" setup>
    import { reactive, ref, computed, defineProps, defineEmits, withDefaults, defineExpose } from "vue";
    import { useI18n } from "vue-i18n";
    import { ElForm, ElMessage } from "element-plus";
    import { Api, DataItem, FormItem } from "./data.d";

    interface Props {
        modelValue: boolean;
        submitLoading?: boolean;
        values: Api;
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

    const defaultValues: Api = props.values || {
        id: 0,
        name: '',
        permission: '',
        pid: 0,
        pName: ''
    };


    // 表单值
    const modelRef = reactive<FormItem>({
        name: defaultValues.name || '',
        permission:  defaultValues.permission || '',
        pid: defaultValues.pid || 0,
        pName: defaultValues.pName || '--'
    });
    // 表单验证
    const rulesRef = reactive({
        name: [
            { required: true, message: t('views.system.apilist.components.formdialog.name.placeholder'), trigger: 'blur' },
            { max: 8, message: t('views.system.apilist.components.formdialog.name.max'), trigger: 'blur' }
        ],
        permission: [
            {
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.system.apilist.components.formdialog.permission.placeholder')));
                    } else if (!/^[a-z0-9/:]+$/.test(value)) {
                        callback(new Error(t('views.system.apilist.components.formdialog.permission.test')));
                    } else if (value.length > 80) {
                        callback(new Error(t('views.system.apilist.components.formdialog.permission.max')));
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
                    <el-form-item :label="t('views.system.apilist.components.formdialog.name')" prop="name">
                        <el-input v-model.trim="modelRef.name" :placeholder="t('views.system.apilist.components.formdialog.name.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.system.apilist.components.formdialog.permission')" prop="permission">
                        <el-input v-model.trim="modelRef.permission" :placeholder="t('views.system.apilist.components.formdialog.permission.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.system.apilist.components.formdialog.pname')">
                        <el-input v-model.trim="modelRef.pName" disabled class="width-200"></el-input>
                    </el-form-item>
                </el-form>

            <template  #footer>
                <el-button @click="visible=false">{{t('views.system.apilist.components.formdialog.btn.cancel')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{t('views.system.apilist.components.formdialog.btn.save')}}</el-button>
            </template>
        </el-dialog>
</template>
