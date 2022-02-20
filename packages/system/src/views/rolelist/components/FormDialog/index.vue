<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
    name: 'FormDialog',
})
</script>
<script lang="ts" setup>
    import { reactive, ref, computed, defineProps, defineEmits, withDefaults, defineExpose } from "vue";
    import { useI18n } from "vue-i18n";
    import { ElForm, ElMessage } from "element-plus";
    import MenuCascader from '@/components/Custom/MenuCascader/index.vue';
    import { StringToArray2d, Array2dToString } from '@/utils/formatData';
    import { TableListItem } from "../../data.d";
    import { DataItem, FormItem } from "./data.d";

    interface Props {
        modelValue: boolean;
        submitLoading?: boolean;
        values?: TableListItem;
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

    const defaultValues: TableListItem = props.values || {
        id: 0,
        name: '',
        description: '',
        resources: '',
        resourcesLevel: ''
    };
    const isEdit = ref<boolean>(props.values?true:false);


    // 表单值
    const modelRef = reactive<FormItem>({
        name: defaultValues.name || '',
        description:  defaultValues.description || '',
        resources: StringToArray2d(defaultValues.resourcesLevel)
    });
    // 表单验证
    const rulesRef = reactive({
        name: [
            { required: true, message: t('views.system.rolelist.components.formdialog.name.placeholder'), trigger: 'blur' },
            { max: 10, message: t('views.system.rolelist.components.formdialog.name.max'), trigger: 'blur' }
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
                const idObj = Array2dToString(modelRef.resources);
                await props.onSubmit({
                    name: modelRef.name,
                    description: modelRef.description,
                    resources: idObj.idStr,
                    resourcesLevel: idObj.idsStr
                });
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

                <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="140px" >

                    <el-form-item :label="t('views.system.rolelist.components.formdialog.name')" prop="name">
                        <el-input v-model.trim="modelRef.name" :placeholder="t('views.system.rolelist.components.formdialog.name.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.system.rolelist.components.formdialog.description')" prop="description">
                        <el-input v-model.trim="modelRef.description" :placeholder="t('views.system.rolelist.components.formdialog.description.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.system.rolelist.components.formdialog.resources')" prop="resources">
                       <menu-cascader
                           v-model="modelRef.resources"
                           v-model:isEdit="isEdit"
                           :multipleSelection="true"
                           :checkStrictly="true"
                           :placeholder="t('views.system.rolelist.components.formdialog.resources.placeholder')"
                           class="width-200">
                       </menu-cascader>
                    </el-form-item>
                </el-form>

            <template  #footer>
                <el-button @click="visible=false">{{t('views.system.rolelist.components.formdialog.btn.cancel')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{t('views.system.rolelist.components.formdialog.btn.save')}}</el-button>
            </template>
        </el-dialog>
</template>
