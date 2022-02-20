<script lang="ts" setup>
    import RestDrawer from "@/components/RestDrawer/index.vue";
    import LinksCategorySelect from "@/components/Custom/LinksCategorySelect/index.vue";
    import { SearchFormItem, SearchValues } from "./data.d";
    import { useI18n } from "vue-i18n";
    import { reactive, ref, computed, defineProps, defineEmits, withDefaults, defineExpose } from "vue";

    const { t } = useI18n();

    interface Props {
        modelValue: boolean;
        title?: string;
        onReset: (values: SearchValues) => void;
        onSubmit: (values: SearchValues) => void;
    }

    const props = withDefaults(defineProps<Props>(), {
        title: 'Search'/* t('views.links.list.components.search.title') */
    })

    const emit = defineEmits(['update:modelValue'])
    const visible = computed<boolean>({
        get: () => props.modelValue,
        set: val => {
            emit('update:modelValue', val);
        }
    });

    // 表单值
    const modelRef = reactive<SearchFormItem>({
        keywords: '',
        categoryid: ''
    });
    const setModelRef = (param: SearchFormItem): void => {
        modelRef.keywords = param.keywords || '';
        modelRef.categoryid = param.categoryid ||  '';
    }


     // form

    const onResetFrom = async (): Promise<void> => {
        try {
            setModelRef({
                keywords: '',
                categoryid: ''
            });
            props.onReset({
                keywords: '',
                categoryid: ''
            });
        } catch (error) {
            console.log('error', error);
        }
    }
    const onSearch = async (): Promise<void> => {
        try {
            props.onSubmit({
                keywords: modelRef.keywords,
                categoryid: modelRef.categoryid
            });
        } catch (error) {
            console.log('error', error);
        }
    }

    defineExpose({
        setModelRef
    })

</script>
<template>
    <rest-drawer
      size="390px"
      :title="title"
      v-model="visible"
    >

        <a-form label-position="top">

            <a-form-item :label="t('views.links.list.components.search.form.keywords')" >
                <a-input v-model:value="modelRef.keywords" :placeholder="t('views.links.list.components.search.form.keywords.placeholder')" />
            </a-form-item>
            <a-form-item :label="t('views.links.list.components.search.form.category')" >
                <links-category-select v-model:value="modelRef.categoryid" :placeholder="t('views.links.list.components.search.form.category.placeholder')" > </links-category-select>
            </a-form-item>

        </a-form>



        <template #footer>
            <div class="text-align-right">
                <a-button style="margin-right: 8px" @click="onResetFrom">
                    {{t('views.links.list.components.search.form.button.reset')}}
                </a-button>
                <a-button type="primary" @click="onSearch">
                    {{t('views.links.list.components.search.form.button.primary')}}
                </a-button>
            </div>
        </template>


    </rest-drawer>
</template>
<style lang="scss" scoped>
</style>
