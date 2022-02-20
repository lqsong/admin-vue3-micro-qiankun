<script lang="ts" setup>
    import { reactive, ref, computed, defineProps, defineEmits, withDefaults, defineExpose } from "vue";
    import { useI18n } from "vue-i18n";
    import { message, Form } from 'ant-design-vue';
    import LinksCategorySelect from "@/components/Custom/LinksCategorySelect/index.vue";
    import { OptionItem } from '@/components/Custom/LinksCategorySelect/data.d';
    import { Link, DataItem, FormItem } from "./data.d";

    const useForm = Form.useForm;

    interface Props {
        modelValue: boolean;
        submitLoading?: boolean;
        values?: Link;
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

    const defaultValues: Link = props.values || {
        id: 0,
        category: { id:0, name: '', alias: '' },
        href: '',
        description: '',
        logo: '',
        title: '',
    };

    const categoryDefaultOptions = ref<OptionItem[]>(defaultValues.category.id > 0? [{value: defaultValues.category.id,label: defaultValues.category.name}] : [])

    // 表单值
    const modelRef = reactive<FormItem>({
        categoryId: defaultValues.category.id || '',
        title: defaultValues.title || '',
        href:  defaultValues.href || '',
        description:  defaultValues.description || '',
        logo: defaultValues.logo ? [defaultValues.logo] : []
    });
    // 表单验证
    const rulesRef = reactive({
        categoryId: [
            {
                required: true,
                validator: async (rule:any, value: string) => {
                    if (value === '') {
                        throw new Error(t('views.links.list.components.formdialog.category.placeholder'));
                    }
                },
                trigger: ['change', 'blur']
            },
        ],
        title: [
            { required: true, message: t('views.links.list.components.formdialog.title.placeholder'), trigger: 'blur' },
            { max: 50, message: t('views.links.list.components.formdialog.title.max'), trigger: 'blur' }
        ],
        description: [
            { required: true, message: t('views.links.list.components.formdialog.description.placeholder'), trigger: 'blur' },
            { max: 100, message: t('views.links.list.components.formdialog.description.max'), trigger: 'blur' }
        ],
        href: [
            {
                required: true,
                validator: (rule, value, callback) => {
                    if (value === '') {
                        callback(new Error(t('views.links.list.components.formdialog.href.placeholder')));
                    } else if (!/^(https?:)/.test(value)) {
                        callback(new Error(t('views.links.list.components.formdialog.href.test')));
                    }else {
                        callback();
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
            await props.onSubmit({
                categoryId: modelRef.categoryId,
                title: modelRef.title,
                href: modelRef.href,
                description: modelRef.description,
                logo: modelRef.logo.join(',')
            });

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
              <a-form-item :label="t('views.links.list.components.formdialog.category')" v-bind="validateInfos.categoryId">
                  <links-category-select
                      :default-options="categoryDefaultOptions"
                      v-model:value="modelRef.categoryId"
                      :placeholder="t('views.links.list.components.formdialog.category.placeholder')"
                      class="width-200">
                  </links-category-select>
              </a-form-item>
              <a-form-item :label="t('views.links.list.components.formdialog.title')" v-bind="validateInfos.title">
                  <a-input v-model:value="modelRef.title" :placeholder="t('views.links.list.components.formdialog.title.placeholder')" class="width-200"></a-input>
              </a-form-item>
              <a-form-item :label="t('views.links.list.components.formdialog.href')" v-bind="validateInfos.href">
                  <a-input v-model:value="modelRef.href" :placeholder="t('views.links.list.components.formdialog.href.placeholder')" class="width-200"></a-input>
              </a-form-item>
              <a-form-item :label="t('views.links.list.components.formdialog.description')" v-bind="validateInfos.description">
                  <a-textarea v-model:value="modelRef.description" :placeholder="t('views.links.list.components.formdialog.description.placeholder')" class="width-200"></a-textarea>
              </a-form-item>
          </a-form>

      <template  #footer>
          <a-button @click="visible=false">{{t('views.links.list.components.formdialog.btn.cancel')}}</a-button>
          <a-button type="primary" :loading="submitLoading" @click="handleSubmit">{{t('views.links.list.components.formdialog.btn.save')}}</a-button>
      </template>
    </a-modal>
</template>
