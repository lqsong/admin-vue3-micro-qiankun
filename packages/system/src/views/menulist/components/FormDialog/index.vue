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
    import MenuTypeSelect from '@/components/Custom/MenuTypeSelect/index.vue';
    import ApiCascader from '@/components/Custom/ApiCascader/index.vue';
    import { StringToArray2d, Array2dToString } from '@/utils/formatData';
    import { Menu, DataItem, FormItem } from "./data.d";

    interface Props {
        modelValue: boolean;
        submitLoading?: boolean;
        values: Menu;
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

    const defaultValues: Menu = props.values || {
        id: 0,
        name: '',
        urlcode: '',
        type: '',
        perms: '',
        permsLevel: '',
        pid: 0,
        pName: ''
    };
    const isEdit = ref<boolean>(defaultValues.id > 0 ? true:false);


    // 表单值
    const modelRef = reactive<FormItem>({
        name: defaultValues.name || '',
        urlcode:  defaultValues.urlcode || '',
        type:  defaultValues.type || '',
        perms: StringToArray2d(defaultValues.permsLevel),
        pid: defaultValues.pid || 0,
        pName: defaultValues.pName || '--'
    });
    // 表单验证
    const rulesRef = reactive({
        name: [
            { required: true, message: t('views.system.menulist.components.formdialog.name.placeholder'), trigger: 'blur' },
            { max: 8, message: t('views.system.menulist.components.formdialog.name.max'), trigger: 'blur' }
        ],
        urlcode: [
            {
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.system.menulist.components.formdialog.urlcode.placeholder')));
                    } else if (!/^[a-z0-9/-]+$/.test(value)) {
                        callback(new Error(t('views.system.menulist.components.formdialog.urlcode.test')));
                    } else if (value.length > 80) {
                        callback(new Error(t('views.system.menulist.components.formdialog.urlcode.max')));
                    }else {
                        callback();
                    }
                },
                trigger: 'blur'
            }
        ],
        type: [
            { required: true, message: t('views.system.menulist.components.formdialog.type.placeholder'), trigger: 'change' }
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
                const idObj = Array2dToString(modelRef.perms);
                await props.onSubmit({
                    name: modelRef.name || '',
                    urlcode: modelRef.urlcode || '',
                    type: modelRef.type || '',
                    perms: idObj.idStr,
                    permsLevel: idObj.idsStr,
                    pid: modelRef.pid || 0
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

                <el-form :model="modelRef" :rules="rulesRef" ref="formRef" label-width="130px" >
                    <el-form-item :label="t('views.system.menulist.components.formdialog.name')" prop="name">
                        <el-input v-model.trim="modelRef.name" :placeholder="t('views.system.menulist.components.formdialog.name.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.system.menulist.components.formdialog.urlcode')" prop="urlcode">
                        <el-input v-model.trim="modelRef.urlcode" :placeholder="t('views.system.menulist.components.formdialog.urlcode.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.system.menulist.components.formdialog.type')" prop="type">
                        <menu-type-select
                            v-model="modelRef.type"
                            :placeholder="t('views.system.menulist.components.formdialog.type.placeholder')"
                            class="width-200">
                        </menu-type-select>
                    </el-form-item>
                    <el-form-item :label="t('views.system.menulist.components.formdialog.perms')" prop="perms">
                        <api-cascader
                           v-model="modelRef.perms"
                           v-model:isEdit="isEdit"
                           :multipleSelection="true"
                           :checkStrictly="true"
                           :placeholder="t('views.system.menulist.components.formdialog.perms.placeholder')"
                           class="width-200">
                       </api-cascader>
                    </el-form-item>
                    <el-form-item :label="t('views.system.menulist.components.formdialog.pname')">
                        <el-input v-model.trim="modelRef.pName" disabled class="width-200"></el-input>
                    </el-form-item>
                </el-form>

            <template  #footer>
                <el-button @click="visible=false">{{t('views.system.menulist.components.formdialog.btn.cancel')}}</el-button>
                <el-button type="primary" :loading="submitLoading" @click="handleSubmit">{{t('views.system.menulist.components.formdialog.btn.save')}}</el-button>
            </template>
        </el-dialog>
</template>
