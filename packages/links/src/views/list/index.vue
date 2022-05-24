<script lang="ts" setup>
    import ScreenTable from '@/components/ScreenTable/index.vue';
    import SearchDrawer from './components/SearchDrawer/index.vue';
    import { SearchProps, SearchFormItem } from "./components/SearchDrawer/data.d";
    import FormDialog from './components/FormDialog/index.vue';
    import { FormDialogProps } from "./components/FormDialog/data.d";
    import { TableDataType, TableListItem, TableListQueryParams } from "./data.d";
    import useQueryList from '@/composables/useQueryList'
    import { ResponseData } from '@/utils/request';
    import { queryList, removeData, detailData, linksAdd, linksEdit } from "./service";
    import { message } from "ant-design-vue";
    import { useI18n } from "vue-i18n";
    import { DefineComponent, reactive, ref, watchEffect } from "vue";

    const { t } = useI18n();


    // 列表 - 初始化数据
    const tableData = reactive<TableDataType>({
        loading: false,
        list: [],
        columns: [
          {
            title: t('views.links.list.table.column.index'),
            dataIndex: 'index',
            width: 80,
            customRender: ({text, index}: { text: any; index: number}) => {
              return (tableData.pagination.current - 1) * tableData.pagination.pageSize + index + 1;
            },
          },
          {
            title: t('views.links.list.table.column.title'),
            dataIndex: 'title',
          },
          {
            title: t('views.links.list.table.column.category'),
            dataIndex: 'category',
            slots: { customRender: 'category' },
          },

          {
            title: t('views.links.list.table.column.action'),
            dataIndex: 'action',
            width: 200,
            fixed: true,
            slots: { customRender: 'action' },
          },
        ],
        pagination: {
            total: 0,
            current: 1,
            pageSize: 0,
            showSizeChanger: false,
            showQuickJumper: false,
            onChange: () => {},
            showSizeChange: () => {}
        }
    })
    // 列表 - 获取数据
    const { pushQuery, queryParams } =  useQueryList<TableListQueryParams>('/list', async (queryParams, pushQuery): Promise<void> => {
        tableData.loading = true;
        const response: ResponseData = await queryList(queryParams);

        const { data } = response;
        const list: TableListItem[]  = data.list || [];
        tableData.list =  list;
        tableData.pagination = {
            total: data.total || 0,
            current: queryParams.page,
            pageSize: queryParams.per,
            showSizeChanger: false,
            showQuickJumper: false,
            showSizeChange: (current,size) => pushQuery({per: size, page: 1}),
            onChange: (page) => pushQuery({page})
        }
        tableData.loading = false;
    })


    // 搜索
    const searchDrawerRef = ref<DefineComponent>();
    const searchDrawer = reactive<SearchProps>({
        visible: false,
        onReset: (values) => {
            searchDrawer.visible = false;
            pushQuery({...values, page: 1})
        },
        onSubmit:(values) => {
            searchDrawer.visible = false;
            pushQuery({...values, page: 1})
        }
    });
    // 简单搜索
    const miniSearchInput = ref<string>('');
    const miniSearchBtn = (value: string): void => {
      miniSearchInput.value = value;
      pushQuery({
          keywords: miniSearchInput.value,
          categoryid: '',
          page: 1
      })
    }


    // 动态搜索赋值
    watchEffect(()=> {
        const params: SearchFormItem = {
            keywords: queryParams.value.keywords || '',
            categoryid: queryParams.value.categoryid || ''
        }
        miniSearchInput.value = params.keywords;
        searchDrawerRef.value?.setModelRef({...params})
    })


    // 删除
    const handleDelete = async (index:number, row: TableListItem): Promise<void> => {

        tableData.list[index]['delLoading'] = true;
        try {
            await removeData(row.id)
            message.success(t('views.links.list.table.column.action.buttion.del.success'));
            /**
             * 为了减少请求，
             * 缺点不实时，如果要求精确可以把if(){}删除 保留 else{ 中的内容 }
             */
            if(tableData.list.length > 1) {
                tableData.list.splice(index, 1);
            } else {
                pushQuery({refresh: new Date().getTime()})
            }
        } catch (error: any) {
             message.warning(error.msg || error || 'error');
             tableData.list[index]['delLoading'] = false;
        }


    }


    // 表单
    const formDialogRef = ref<DefineComponent>();
    const formDialog = reactive<FormDialogProps>({
        visible: false,
        submitLoading: false,
        values: undefined,
        onSubmit: async (values) => {
            if(formDialog.values) { // 编辑
                await linksEdit(formDialog.values.id, values);
                formDialog.visible = false;
                pushQuery({refresh: new Date().getTime()})
                message.success(t('views.links.list.components.formdialog.editsuccess'))
            } else { // 新增
                await linksAdd(values);
                formDialog.visible = false;
                pushQuery({
                    keywords: '',
                    categoryid: '',
                    page: 1,
                    refresh: new Date().getTime()
                })
                message.success(t('views.links.list.components.formdialog.addsuccess'))
            }
        }
    })

    // 添加表单弹框 - 显示
    const addFormShow = (): void => {
        formDialog.values = undefined;
        formDialog.visible = true;

    }

    // 编辑表单弹框 - 显示
    const editFormShow = async (index:number, row: TableListItem): Promise<void> => {

        tableData.list[index]['detailLoading'] = true;
        try {
            const response: ResponseData = await detailData(row.id);
            const { data } = response;
            formDialog.values = {
                id: row.id,
                ...data
            };
            formDialog.visible = true;
        } catch (error: any) {
             message.warning(error.msg || error || 'error');
        }
        tableData.list[index]['detailLoading'] = false;

    }



</script>
<template>

    <screen-table
        row-key="id"
        :columns="tableData.columns"
        :data-source="tableData.list"
        :loading="tableData.loading"
        :pagination="tableData.pagination"
    >

        <template #header>
            <a-row>
                    <a-col :span="8">

                        <a-button type="primary" @click="addFormShow"> {{t('views.links.list.button.add')}}</a-button>

                    </a-col>
                    <a-col :span="16" class="text-align-right">

                        <a-input-search class="width-200" :placeholder="t('views.links.list.search.input.placeholder')" @search="miniSearchBtn" />
                        <a-button style="margin-left: 8px" @click="() => searchDrawer.visible = true">{{t('views.links.list.button.search')}}</a-button>
                    </a-col>
            </a-row>
        </template>


        <template #category="{ record }">
             {{ record.category.name }}
        </template>

        <template #action="{ record, index }">
            <a-button type="link" :loading="record.detailLoading" @click="editFormShow(index, record)">{{t('views.links.list.table.column.action.buttion.edit')}}</a-button>
            <a-popconfirm
              :title="t('views.links.list.table.column.action.buttion.del.popconfirm')"
              @confirm="handleDelete(index, record)"
            >
              <a-button type="link" :loading="record.delLoading">{{t('views.links.list.table.column.action.buttion.del')}}</a-button>
            </a-popconfirm>
        </template>

    </screen-table>


     <search-drawer
        ref="searchDrawerRef"
        v-model="searchDrawer.visible"
        :title="t('views.links.list.components.search.title')"
        :onReset="searchDrawer.onReset"
        :onSubmit="searchDrawer.onSubmit"
    />

    <form-dialog
        v-if="formDialog.visible"
        ref="formDialogRef"
        :title="formDialog.values?t('views.links.list.components.formdialog.edit.title'):t('views.links.list.components.formdialog.add.title')"
        v-model="formDialog.visible"
        v-model:submitLoading="formDialog.submitLoading"
        :values="formDialog.values"
        :onSubmit="formDialog.onSubmit"
    />



</template>


