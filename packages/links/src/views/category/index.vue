<script lang="ts" setup>
    import ScreenTable from '@/components/ScreenTable/index.vue';
    import FormDialog from './components/FormDialog/index.vue';
    import { FormDialogProps } from "./components/FormDialog/data.d";
    import { TableDataType, CategoryItem } from "./data.d";
    import { ResponseData } from '@/utils/request';
    import { queryList, removeData, categoryAdd, categoryEdit } from "./service";
    import { message } from "ant-design-vue";
    import { useI18n } from "vue-i18n";
    import { DefineComponent, reactive, ref, onMounted } from "vue";

    const { t } = useI18n();


    // 列表 - 初始化数据
    const tableData = reactive<TableDataType>({
        loading: false,
        columns: [
          {
            title: t('views.links.category.table.column.index'),
            dataIndex: 'index',
            width: 80,
            customRender: ({text, index}: { text: any; index: number}) => index + 1,
          },
          {
            title: t('views.links.category.table.column.name'),
            dataIndex: 'name',
          },
          {
            title: t('views.links.category.table.column.alias'),
            dataIndex: 'alias',
          },
          {
            title: t('views.links.category.table.column.sort'),
            dataIndex: 'sort',
          },
          {
            title: t('views.links.category.table.column.action'),
            dataIndex: 'action',
            width: 200,
            fixed: true,
            slots: { customRender: 'action' },
          },
        ],
        list: []
    })
    // 列表 - 获取数据
    const getList = async (): Promise<void> => {
        tableData.loading = true;
        const response: ResponseData = await queryList();

        const { data } = response;
        const list: CategoryItem[]  = data || [];
        tableData.list =  list;
        tableData.loading = false;

    }
    onMounted(()=> {
        getList()
    })






    // 删除
    const handleDelete = async (index:number, row: CategoryItem): Promise<void> => {

        tableData.list[index]['delLoading'] = true;
        try {
            await removeData(row.id)
            message.success(t('views.links.category.table.column.action.buttion.del.success'));
            if(tableData.list.length > 1) {
                tableData.list.splice(index, 1);
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
                await categoryEdit(formDialog.values.id, values);
                formDialog.visible = false;
                getList()
                message.success(t('views.links.category.components.formdialog.editsuccess'))
            } else { // 新增
                await categoryAdd(values);
                formDialog.visible = false;
                getList()
                message.success(t('views.links.category.components.formdialog.addsuccess'))
            }
        }
    })

    // 添加表单弹框 - 显示
    const addFormShow = (): void => {
        formDialog.values = undefined;
        formDialog.visible = true;
    }

    // 编辑表单弹框 - 显示
    const editFormShow = async (row: CategoryItem): Promise<void> => {
        formDialog.values = {
            ...row
        };
        formDialog.visible = true;
    }



</script>
<template>

    <screen-table
        row-key="id"
        :columns="tableData.columns"
        :data-source="tableData.list"
        :loading="tableData.loading"
    >

        <template #header>
          <a-row>
            <a-col :span="24">
                <a-button type="primary" @click="addFormShow"> {{t('views.links.category.button.add')}}</a-button>
            </a-col>
          </a-row>
        </template>


        <template #action="{ record, index }">
            <a-button type="link" @click="editFormShow(record)">{{t('views.links.category.table.column.action.buttion.edit')}}</a-button>
            <a-popconfirm
              :title="t('views.links.category.table.column.action.buttion.del.popconfirm')"
              @confirm="handleDelete(index, record)"
            >
              <a-button type="link" :loading="record.delLoading">{{t('views.links.category.table.column.action.buttion.del')}}</a-button>
            </a-popconfirm>
        </template>


    </screen-table>



    <form-dialog
        v-if="formDialog.visible"
        ref="formDialogRef"
        :title="formDialog.values?t('views.links.category.components.formdialog.edit.title'):t('views.links.category.components.formdialog.add.title')"
        v-model="formDialog.visible"
        v-model:submitLoading="formDialog.submitLoading"
        :values="formDialog.values"
        :onSubmit="formDialog.onSubmit"
    />



</template>


