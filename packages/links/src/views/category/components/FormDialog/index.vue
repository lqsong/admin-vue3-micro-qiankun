<script lang="ts" setup>
    import { reactive, ref, computed, defineProps, defineEmits, withDefaults } from "vue";
    import { useI18n } from "vue-i18n";
    import { message, Form } from 'ant-design-vue';
    import { CategoryItem } from "../../data.d";
    import { DataItem, FormItem } from "./data.d";

    const useForm = Form.useForm;

    interface Props {
        modelValue: boolean;
        submitLoading?: boolean;
        values?: CategoryItem;
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

    const defaultValues: CategoryItem = props.values || {
        id: 0,
        name: '',
        alias: '',
        sort: 0
    };


    // 表单值
    const modelRef = reactive<FormItem>({
        name: defaultValues.name || '',
        alias:  defaultValues.alias || '',
        sort:  defaultValues.sort || 0
    });
    // 表单验证
    const rulesRef = reactive({
        name: [
           {
                required: true,
                validator: async (rule:any, value: string) => {
                    if (value === '') {
                        throw new Error(t('views.links.category.components.formdialog.name.placeholder'));
                    } else if (/[,]+/.test(value)) {
                        throw new Error(t('views.links.category.components.formdialog.name.test'));
                    } else if (value.length > 10) {
                        throw new Error(t('views.links.category.components.formdialog.name.max'));
                    }
                },
                trigger: 'blur'
            }
        ],
        alias: [
            {
                required: true,
                validator: async (rule:any, value: string) => {
                    if (value === '') {
                        throw new Error(t('views.links.category.components.formdialog.alias.placeholder'));
                    } else if (!/^[a-z]+$/.test(value)) {
                        throw new Error(t('views.links.category.components.formdialog.alias.test'));
                    } else if (value.length > 50) {
                        throw new Error(t('views.links.category.components.formdialog.alias.max'));
                    }
                },
                trigger: 'blur'
            }
        ],
        sort: [
          {
                required: true,
                validator: async (rule:any, value: number) => {
                    if (value === null) {
                        throw new Error(t('views.links.category.components.formdialog.sort.placeholder'));
                    }
                },
                trigger: 'blur'
            }
        ]
    });

    // 获取表单内容
    const { validate, validateInfos } = useForm(modelRef, rulesRef);


    // submit
    const handleSubmit = async (): Promise<void> => {

        submitLoading.value = true;
        try {
            await validate<FormItem>();
            await props.onSubmit(modelRef);
        } catch (error) {
            // console.log(error);
            message.warning(t('app.global.form.validatefields.catch'));
        }
        submitLoading.value = false;
    }




</script>
<template>
    <a-modal
      :title="props.title"
      width="500px"
      :destroy-on-close="true"
      :mask-closable="false"
      :visible="visible">

          <a-form :labelCol="{ span: 4 }" :wrapper-col="{span:20}" >
              <a-form-item :label="t('views.links.category.components.formdialog.name')" v-bind="validateInfos.name">
                  <a-input v-model:value="modelRef.name" :placeholder="t('views.links.category.components.formdialog.name.placeholder')" class="width-200"></a-input>
              </a-form-item>

              <a-form-item :label="t('views.links.category.components.formdialog.alias')" v-bind="validateInfos.alias">
                  <a-input v-model:value="modelRef.alias" :placeholder="t('views.links.category.components.formdialog.alias.placeholder')" class="width-200"></a-input>
              </a-form-item>
              <a-form-item :label="t('views.links.category.components.formdialog.sort')" v-bind="validateInfos.sort">
                  <a-input-number :min="0" :max="999" v-model:value="modelRef.sort"  :placeholder="t('views.links.category.components.formdialog.sort.placeholder')" class="width-200"></a-input-number>
              </a-form-item>
          </a-form>

      <template #footer>
          <a-button @click="visible=false">{{t('views.links.category.components.formdialog.btn.cancel')}}</a-button>
          <a-button type="primary" :loading="submitLoading" @click="handleSubmit">{{t('views.links.category.components.formdialog.btn.save')}}</a-button>
      </template>
    </a-modal>
</template>
