<script lang="ts" setup>
    import PageHeader from '@/components/Custom/PageHeader/index.vue';
    import FormFooterToolbar from '@/components/Custom/FormFooterToolbar/index.vue';
    import ArticleCategoryCascader from "@/components/Custom/ArticleCategoryCascader/index.vue";
    import TagSelect from "@/components/Custom/TagSelect/index.vue";
    import ServerImageSelectionList from '@/components/Custom/ServerImage/SelectionList/index.vue';
    import TuiEditor from "@/components/TuiEditor/index.vue";
    import ArticleListDrawer from "@/components/Custom/ArticleListDrawer/index.vue";
    import { FormItem, ArticleRec } from './data.d';
    import { articleAdd } from './service';
    import { ElForm, ElMessage, ElMessageBox } from "element-plus";
    import { useI18n } from "vue-i18n";
    import { computed, reactive, ref } from "vue";
    import { useRouter } from 'vue-router';
    import useRestRouter from '@/composables/useRestRouter';
    import useRestStore from '@/composables/useRestStore';


    const { t } = useI18n();
    const router = useRouter();
    const restRouter = useRestRouter();
    const store = useRestStore();

    // 表单值
    const modelRef = reactive<FormItem>({
          title: '',
          category: [],
          addtime: '',
          keywords: '',
          description: '',
          tag: [],
          thumb: [],
          content: ''
    });
    // 表单验证
    const rulesRef = reactive({
        title: [
            { required: true, message: t('views.article.add.form.title.placeholder'), trigger: 'blur' },
            { min: 5, max: 100, message: t('views.article.add.form.title.minmax'), trigger: 'blur' }
        ],
        category: [
            { required: true, message: t('views.article.add.form.category.placeholder'), trigger: 'change' }
        ],
        addtime: [
            { required: true, message: t('views.article.add.form.addtime.placeholder'), trigger: 'change' }
        ],
        keywords:[
            { required: true, message: t('views.article.add.form.keywords.placeholder'), trigger: 'blur' },
            { min: 2, max: 50, message: t('views.article.add.form.keywords.minmax'), trigger: 'blur' }
        ],
        description: [
            { required: true, message: t('views.article.add.form.description.placeholder'), trigger: 'blur' },
            { min: 10, max: 200, message: t('views.article.add.form.description.minmax'), trigger: 'blur' }
        ]
    });
    // form
    const formRef = ref<typeof ElForm>();


    const articleRec = reactive<ArticleRec>({
        list: [],
        drawerVisible: false,
        selectArticle: (row) => {
            if(articleRec.list.length >=10 ) {
                ElMessage({ message: t('views.article.add.articlerec.tips'), type: 'error' });
                articleRec.drawerVisible = false;
                return false;
            }
            articleRec.list.push({
                id: row.id,
                title: row.title,
                addtime: row.addtime
            })
            ElMessage({ message: t('views.article.add.articlerec.choose.success'), type: 'success' });
        },
        deleteArticleRow:(index: number) => {
            articleRec.list.splice(index, 1);
        }

    })
    const articleRecIds = computed<number[]>(()=>articleRec.list.map((item)=>item.id));


    // submit loading
    const submitLoading = ref<boolean>(false);
    // submit
    const handleSubmit = async (): Promise<void> => {

        submitLoading.value = true;
        try {
            const valid: boolean | undefined =  await formRef.value?.validate();
            if(valid === true) {
                const categoryLen = modelRef.category.length;

                const categoryId = categoryLen > 0 ? modelRef.category[categoryLen - 1] : '';

                const paramData = {
                    title: modelRef.title,
                    keywords: modelRef.keywords,
                    description: modelRef.description,
                    addtime: modelRef.addtime,
                    categoryId: categoryId,
                    categoryIds: modelRef.category.join(','),
                    tag: modelRef.tag.join(','),
                    thumb: modelRef.thumb.join('|'),
                    content: modelRef.content,
                    interestIds: articleRecIds.value.join(',')
                };
                await articleAdd(paramData);
                ElMessageBox.confirm(t('views.article.add.submit.confirm.msg'),t('views.article.add.submit.confirm.title'), {
                    confirmButtonText: t('views.article.add.submit.confirm.btn1'),
                    cancelButtonText: t('views.article.add.submit.confirm.btn2'),
                    type: 'success',
                    closeOnClickModal: false
                }).then(() => {

                  modelRef.title = '';
                  modelRef.category = [];
                  modelRef.addtime = '';
                  modelRef.keywords = '';
                  modelRef.description = '';
                  modelRef.tag = [];
                  modelRef.thumb = [];
                  modelRef.content = '';
                  articleRec.list = [];

                }).catch(() => {
                  store.commit('global/closeCurrentHeadTabNav',() => {
                    restRouter.push(router.resolve('/list').href)
                  });
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
<div>

    <page-header>{{t('views.article.add.header.title')}}</page-header>

    <el-form label-position="top" :model="modelRef" :rules="rulesRef" ref="formRef">
        <el-card shadow="never" class="border-none margin-t24">
            <template #header>
                <span>{{t('views.article.add.base.title')}}</span>
            </template>
            <el-row :gutter="24">
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.add.form.title')" prop="title">
                      <el-input v-model.trim="modelRef.title" :placeholder="t('views.article.add.form.title.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                   <el-form-item :label="t('views.article.add.form.category')" prop="category">

                      <article-category-cascader
                        v-model="modelRef.category"
                        :placeholder="t('views.article.add.form.category.placeholder')"
                        class="width-percent100">
                      </article-category-cascader>

                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.add.form.addtime')" prop="addtime">
                        <el-date-picker
                            v-model="modelRef.addtime"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            :placeholder="t('views.article.add.form.addtime.placeholder')"
                            class="width-percent100">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.add.form.keywords')" prop="keywords">
                      <el-input v-model.trim="modelRef.keywords" :placeholder="t('views.article.add.form.keywords.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.add.form.description')" prop="description">
                      <el-input v-model.trim="modelRef.description" :placeholder="t('views.article.add.form.description.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.add.form.tag')">
                      <tag-select
                        v-model="modelRef.tag"
                        :placeholder="t('views.article.add.form.tag.placeholder')"
                        class="width-percent100">
                      </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>
    </el-form>

    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.article.add.pic.title')}}</span>
            <el-link href="javascript:;" type="warning" :underline="false" class="margin-l10">{{t('views.article.add.pic.tips')}}</el-link>
        </template>
        <server-image-selection-list v-model="modelRef.thumb" :limit="4"></server-image-selection-list>
    </el-card>


    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.article.add.content.title')}}</span>
        </template>
        <tui-editor v-model="modelRef.content" ></tui-editor>
    </el-card>


    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.article.add.articlerec.title')}}</span>
            <el-link href="javascript:;" type="warning" :underline="false" class="margin-l10">{{t('views.article.add.articlerec.tips')}}</el-link>

            <el-link type="primary" href="javascript:;" :underline="false" class="float-right" @click="articleRec.drawerVisible=true" >{{t('views.article.add.articlerec.btn.show')}}</el-link>
        </template>
        <el-table
               header-row-class-name="custom-table-header"
               stripe
              :data="articleRec.list">
              <el-table-column
                type="index"
                :label="t('views.article.add.articlerec.table.column.index')"
                width="60">
              </el-table-column>
              <el-table-column
                prop="id"
                :label="t('views.article.add.articlerec.table.column.id')"
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="title"
                :label="t('views.article.add.articlerec.table.column.title')"
                min-width="300">
              </el-table-column>
              <el-table-column
                prop="addtime"
                :label="t('views.article.add.articlerec.table.column.addtime')"
                min-width="150">
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="t('views.article.add.articlerec.table.column.action')"
                min-width="120">
                <template  #default="scope">
                  <el-button
                    @click="articleRec.deleteArticleRow(scope.$index)"
                    type="text"
                    size="small">
                    {{t('views.article.add.articlerec.btn.del')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
    </el-card>
    <article-list-drawer v-model="articleRec.drawerVisible" :title="t('views.article.add.articlerec.drawer.title')">
        <template #el-table-column>
          <el-table-column
            fixed="right"
            width="100"
            :label="t('views.article.add.articlerec.drawer.action')">
            <template #default="scope">
              <el-button
                v-if="articleRecIds.includes(scope.row.id)"
                disabled
                type="info"
                size="small">
                {{t('views.article.add.articlerec.drawer.btn1')}}
              </el-button>
              <el-button
                v-else
                type="primary"
                size="small"
                @click="articleRec.selectArticle(scope.row)">
                {{t('views.article.add.articlerec.drawer.btn2')}}
              </el-button>
            </template>
          </el-table-column>
        </template>
    </article-list-drawer>


    <form-footer-toolbar>
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" >{{t('views.article.add.form.btn.submit')}}</el-button>
    </form-footer-toolbar>





</div>
</template>
