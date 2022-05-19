<script lang="ts" setup>
    import { computed, reactive, ref } from "vue";
    import { useI18n } from "vue-i18n";
    import { ElForm, ElMessage, ElLoading } from "element-plus";
    import PageHeader from '@/components/Custom/PageHeader/index.vue';
    import FormFooterToolbar from '@/components/Custom/FormFooterToolbar/index.vue';
    import ArticleCategoryCascader from "@/components/Custom/ArticleCategoryCascader/index.vue";
    import TagSelect from "@/components/Custom/TagSelect/index.vue";
    import ServerImageSelectionList from '@/components/Custom/ServerImage/SelectionList/index.vue';
    import TuiEditor from "@/components/TuiEditor/index.vue";
    import ArticleListDrawer from "@/components/Custom/ArticleListDrawer/index.vue";
    import useQueryVerifyId from '@/composables/useQueryVerifyId';
    import useParentMainCloseCurrentHeadTabNav from '@/composables/useParentMainCloseCurrentHeadTabNav';
    import useRouterPushCombineParentMain from '@/composables/useRouterPushCombineParentMain';
    import { trimComma, trimVerticalBar } from "@/utils/trim";
    import { ResponseData } from '@/utils/request';
    import { articleDetail, articleEdit } from './service';
    import { FormItem, ArticleRec } from "./data.d";
   

    const { t } = useI18n();
   

    const parentMainCloseCurrentHeadTabNav = useParentMainCloseCurrentHeadTabNav();
    const listJumpFun = useRouterPushCombineParentMain('/list'); // 列表跳转函数

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
            { required: true, message: t('views.article.edit.form.title.placeholder'), trigger: 'blur' },
            { min: 5, max: 100, message: t('views.article.edit.form.title.minmax'), trigger: 'blur' }
        ],
        category: [
            { required: true, message: t('views.article.edit.form.category.placeholder'), trigger: 'change' }
        ],
        addtime: [
            { required: true, message: t('views.article.edit.form.addtime.placeholder'), trigger: 'change' }
        ],
        keywords:[
            { required: true, message: t('views.article.edit.form.keywords.placeholder'), trigger: 'blur' },
            { min: 2, max: 50, message: t('views.article.edit.form.keywords.minmax'), trigger: 'blur' }
        ],
        description: [
            { required: true, message: t('views.article.edit.form.description.placeholder'), trigger: 'blur' },
            { min: 10, max: 200, message: t('views.article.edit.form.description.minmax'), trigger: 'blur' }
        ]
    });
    // form
    const formRef = ref<typeof ElForm>();


    const articleRec = reactive<ArticleRec>({
        list: [],
        drawerVisible: false,
        selectArticle: (row) => {
            if(articleRec.list.length >=10 ) {
                ElMessage({ message: t('views.article.edit.articlerec.tips'), type: 'error' });
                articleRec.drawerVisible = false;
                return false;
            }
            articleRec.list.push({
                id: row.id,
                title: row.title,
                addtime: row.addtime
            })
            ElMessage({ message: t('views.article.edit.articlerec.choose.success'), type: 'success' });
        },
        deleteArticleRow:(index: number) => {
            articleRec.list.splice(index, 1);
        }

    })
    const articleRecIds = computed<number[]>(()=>articleRec.list.map((item)=>item.id));

    const categoryCascaderParam = reactive({
      isEdit: true,
      dataLoading: true
    })
    const id = useQueryVerifyId('/edit', async (id: number) => {
        const loading = ElLoading.service({lock: true})
        categoryCascaderParam.isEdit = true;
        categoryCascaderParam.dataLoading = true;
        try {
          const response: ResponseData = await articleDetail(id);
          const { data } = response;
          const { title, keywords, description, addtime, categoryIds, tag, thumb, content, interest } = data;

          const categoryArr = trimComma(categoryIds).split(',');

          modelRef.title = title;
          modelRef.keywords = keywords;
          modelRef.description = description;
          modelRef.addtime = addtime;
          modelRef.category = categoryArr.map(item=> {
            return Number(item);
          });
          modelRef.tag = trimComma(tag).split(',');
          modelRef.thumb = trimVerticalBar(thumb).split('|');
          modelRef.content = content;
          articleRec.list = interest;
        } catch (error:any) {
            // console.log(error);
            ElMessage.warning(error.msg || error || 'error');
        }
        categoryCascaderParam.isEdit = false;
        loading.close();
    });



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
                await articleEdit(id.value, paramData);

                ElMessage({
                  message: t('views.article.edit.submit.confirm.msg'),
                  type: 'success',
                  onClose: () => {
                    parentMainCloseCurrentHeadTabNav(() => {
                      listJumpFun(); // 跳转列表
                    })
                  }
                })
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

    <page-header>{{t('views.article.edit.header.title')}}</page-header>

    <el-form label-position="top" :model="modelRef" :rules="rulesRef" ref="formRef">
        <el-card shadow="never" class="border-none margin-t24">
            <template #header>
                <span>{{t('views.article.edit.base.title')}}</span>
            </template>
            <el-row :gutter="24">
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.edit.form.title')" prop="title">
                      <el-input v-model.trim="modelRef.title" :placeholder="t('views.article.edit.form.title.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                   <el-form-item :label="t('views.article.edit.form.category')" prop="category">

                      <article-category-cascader
                        :is-edit="categoryCascaderParam.isEdit"
                        :data-loading="categoryCascaderParam.dataLoading"
                        v-model="modelRef.category"
                        :placeholder="t('views.article.edit.form.category.placeholder')"
                        class="width-percent100">
                      </article-category-cascader>

                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.edit.form.addtime')" prop="addtime">
                        <el-date-picker
                            v-model="modelRef.addtime"
                            type="datetime"
                            value-format="YYYY-MM-DD HH:mm:ss"
                            :placeholder="t('views.article.edit.form.addtime.placeholder')"
                            class="width-percent100">
                        </el-date-picker>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.edit.form.keywords')" prop="keywords">
                      <el-input v-model.trim="modelRef.keywords" :placeholder="t('views.article.edit.form.keywords.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.edit.form.description')" prop="description">
                      <el-input v-model.trim="modelRef.description" :placeholder="t('views.article.edit.form.description.placeholder')"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :sm="24" :md="12" :lg="8">
                    <el-form-item :label="t('views.article.edit.form.tag')">
                      <tag-select
                        v-model="modelRef.tag"
                        :placeholder="t('views.article.edit.form.tag.placeholder')"
                        class="width-percent100">
                      </tag-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-card>
    </el-form>

    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.article.edit.pic.title')}}</span>
            <el-link href="javascript:;" type="warning" :underline="false" class="margin-l10">{{t('views.article.edit.pic.tips')}}</el-link>
        </template>
        <server-image-selection-list v-model="modelRef.thumb" :limit="4"></server-image-selection-list>
    </el-card>


    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.article.edit.content.title')}}</span>
        </template>
        <tui-editor v-model="modelRef.content" ></tui-editor>
    </el-card>


    <el-card shadow="never" class="border-none margin-t24">
        <template #header>
            <span>{{t('views.article.edit.articlerec.title')}}</span>
            <el-link href="javascript:;" type="warning" :underline="false" class="margin-l10">{{t('views.article.edit.articlerec.tips')}}</el-link>

            <el-link type="primary" href="javascript:;" :underline="false" class="float-right" @click="articleRec.drawerVisible=true" >{{t('views.article.edit.articlerec.btn.show')}}</el-link>
        </template>
        <el-table
               header-row-class-name="custom-table-header"
               stripe
              :data="articleRec.list">
              <el-table-column
                type="index"
                :label="t('views.article.edit.articlerec.table.column.index')"
                width="60">
              </el-table-column>
              <el-table-column
                prop="id"
                :label="t('views.article.edit.articlerec.table.column.id')"
                min-width="100">
              </el-table-column>
              <el-table-column
                prop="title"
                :label="t('views.article.edit.articlerec.table.column.title')"
                min-width="300">
              </el-table-column>
              <el-table-column
                prop="addtime"
                :label="t('views.article.edit.articlerec.table.column.addtime')"
                min-width="150">
              </el-table-column>
              <el-table-column
                fixed="right"
                :label="t('views.article.edit.articlerec.table.column.action')"
                min-width="120">
                <template  #default="scope">
                  <el-button
                    @click="articleRec.deleteArticleRow(scope.$index)"
                    type="primary"
                    text
                    size="small">
                    {{t('views.article.edit.articlerec.btn.del')}}
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
    </el-card>
    <article-list-drawer v-model="articleRec.drawerVisible" :title="t('views.article.edit.articlerec.drawer.title')">
        <template #el-table-column>
          <el-table-column
            fixed="right"
            width="100"
            :label="t('views.article.edit.articlerec.drawer.action')">
            <template #default="scope">
              <el-button
                v-if="articleRecIds.includes(scope.row.id)"
                disabled
                type="info"
                size="small">
                {{t('views.article.edit.articlerec.drawer.btn1')}}
              </el-button>
              <el-button
                v-else
                type="primary"
                size="small"
                @click="articleRec.selectArticle(scope.row)">
                {{t('views.article.edit.articlerec.drawer.btn2')}}
              </el-button>
            </template>
          </el-table-column>
        </template>
    </article-list-drawer>


    <form-footer-toolbar class="text-right">
        <el-button type="primary" :loading="submitLoading" @click="handleSubmit" >{{t('views.article.edit.form.btn.submit')}}</el-button>
    </form-footer-toolbar>





</div>
</template>
