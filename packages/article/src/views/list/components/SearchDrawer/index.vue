<script lang="ts" setup>
    import RestElDrawer from "@/components/RestElDrawer/index.vue";
    import ArticleCategoryCascader from "@/components/Custom/ArticleCategoryCascader/index.vue";
    import TagSelect from "@/components/Custom/TagSelect/index.vue";
    import { SearchFormItem, SearchValues } from "./data.d";
    import { ElForm } from "element-plus";
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
        title: 'Search'/* t('views.article.list.components.search.title') */
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
        category: [],
        addtime: [],
        tags: []
    });
    const setModelRef = (param: SearchFormItem): void => {
        modelRef.keywords = param.keywords || '';
        modelRef.category = param.category ||  [];
        modelRef.addtime = param.addtime ||  [];
        modelRef.tags = param.tags ||  [];
    }


     // form
    const formRef = ref<typeof ElForm>();
    const onResetFrom = async (): Promise<void> => {
        try {
            setModelRef({
                keywords: '',
                category: [],
                addtime: [],
                tags: []
            });
            props.onReset({
                keywords: '',
                categoryid: '',
                addtimestart: '',
                addtimeend: '',
                tags: ''
            });
        } catch (error) {
            console.log('error', error);
        }
    }
    const onSearch = async (): Promise<void> => {
        try {
            props.onSubmit({
                keywords: modelRef.keywords,
                categoryid: modelRef.category? ([...modelRef.category].pop() || '').toString() : '',
                addtimestart: modelRef.addtime ? modelRef.addtime[0] || '' : '',
                addtimeend: modelRef.addtime ? modelRef.addtime[1] || '' : '',
                tags: modelRef.tags.join(',')
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
    <rest-el-drawer
      size="390px"
      :title="title"
      v-model="visible"
    >

        <el-form label-position="top" :model="modelRef" ref="formRef">

            <el-form-item :label="t('views.article.list.components.search.form.keywords')" >
                <el-input v-model="modelRef.keywords" :placeholder="t('views.article.list.components.search.form.keywords.placeholder')" />
            </el-form-item>
            <el-form-item :label="t('views.article.list.components.search.form.category')" >
                <article-category-cascader v-model="modelRef.category" :placeholder="t('views.article.list.components.search.form.category.placeholder')"   class="width-percent100" > </article-category-cascader>
            </el-form-item>
            <el-form-item :label="t('views.article.list.components.search.form.addtime')">
                <el-date-picker
                    v-model="modelRef.addtime"
                    type="datetimerange"
                    range-separator="—"
                    :start-placeholder="t('views.article.list.components.search.form.addtime.placeholder.start')"
                    :end-placeholder="t('views.article.list.components.search.form.addtime.placeholder.end')"
                    value-format="YYYY-MM-DD HH:mm:ss"
                    class="width-percent100">
                </el-date-picker>
            </el-form-item>
             <el-form-item :label="t('views.article.list.components.search.form.tags')" >
                <tag-select v-model="modelRef.tags" :placeholder="t('views.article.list.components.search.form.tags.placeholder')"  class="width-percent100" > </tag-select>
            </el-form-item>
        </el-form>



        <template #footer>
            <div class="text-align-right">
                <el-button style="margin-right: 8px" @click="onResetFrom">
                    {{t('views.article.list.components.search.form.button.reset')}}
                </el-button>
                <el-button type="primary" @click="onSearch">
                    {{t('views.article.list.components.search.form.button.primary')}}
                </el-button>
            </div>
        </template>


    </rest-el-drawer>
</template>
<style lang="scss" scoped>
</style>
