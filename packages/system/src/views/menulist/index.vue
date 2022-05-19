<script lang="ts" setup>
    import ScreenTreeTable from '@/components/ScreenTreeTable/index.vue';
    import FormDialog from './components/FormDialog/index.vue';
    import { FormDialogProps } from "./components/FormDialog/data.d";
    import { ResponseData } from '@/utils/request';
    import { tablePropType } from "./data.d";
    import { queryList, add, edit, remove } from './service';
    import { LoadFunction } from 'element-plus/es/components/tree/src/tree.type';
    import { ElMessage } from "element-plus";
    import Node from "element-plus/es/components/tree/src/model/node";
    import { useI18n } from "vue-i18n";
    import { DefineComponent, reactive, ref, watch } from "vue";

    const { t, locale } = useI18n();

    const tableRef = ref();
    const tableProp = reactive<tablePropType>({
        loading: true,
        column: [
            {
                title: t('views.system.menulist.table.column.name'),
                label: 'name',
                minWidth: 300
            },
            {
                title: t('views.system.menulist.table.column.urlcode'),
                label: 'urlcode',
                minWidth: 300
            },
            {
                title: t('views.system.menulist.table.column.type'),
                label: 'type',
                minWidth: 200
            }
        ],

    })

    watch(locale, ()=> {
      tableProp.column = [
          {
              title: t('views.system.menulist.table.column.name'),
              label: 'name',
              minWidth: 300
          },
          {
              title: t('views.system.menulist.table.column.urlcode'),
              label: 'urlcode',
              minWidth: 300
          },
          {
              title: t('views.system.menulist.table.column.type'),
              label: 'type',
              minWidth: 200
          }
      ]
    })


    const loadNode: LoadFunction = async (node, resolve) => {

        let pid = 0;
        if (node.level > 0) {
            pid = node.data.id;
        }

        const response: ResponseData = await queryList(pid);
        const { data } = response;
        resolve(data);
        tableProp.loading = false;

    }

    const handleDelete = async (node: any) => {
        node.data['delLoading'] = true;
        try {
            await remove(node.data.id)
            ElMessage.success(t('views.system.menulist.table.column.action.buttion.del.success'));
            tableRef.value['elTree'].remove(node);
        } catch (error: any) {
            ElMessage.warning(error.msg || error || 'error');
            node.data['delLoading'] = false;
        }
    }

    const currNode = ref<Node>();
    // 表单
    const formDialogRef = ref<DefineComponent>();
    const formDialog = reactive<FormDialogProps>({
        visible: false,
        submitLoading: false,
        values: {
            id: 0,
            name: '',
            type: '',
            urlcode: '',
            perms: '',
            permsLevel: '',
            pid: 0,
            pName: ''
        },
        onSubmit: async (values) => {



            if(formDialog.values.id > 0) { // 编辑
                if(!currNode.value) {
                    return;
                }

                await edit(formDialog.values.id, values);
                formDialog.visible = false;
                currNode.value.data = {
                        ...currNode.value.data,
                        ...values
                }
                ElMessage({
                  message: t('views.system.menulist.components.formdialog.editsuccess'),
                  type: 'success',
                  onClose: () => { }
                })
            } else { // 新增
                const response: ResponseData = await add(values);
                const { data } = response;
                if(values.pid > 0) {
                    if(!currNode.value) {
                        return;
                    }
                    tableRef.value['elTree'].append(
                        {
                            ...values,
                            id: data.id || 0
                        },
                        currNode.value
                    );
                } else {
                    tableRef.value['elTree'].append(
                        {
                            ...values,
                            id: data.id || 0
                        }
                    );
                }
                formDialog.visible = false;

                ElMessage({
                  message: t('views.system.menulist.components.formdialog.addsuccess'),
                  type: 'success',
                  onClose: () => {}
                })
            }
        }
    })

    // 添加表单弹框 - 显示
    const addFormShow = (node?: Node): void => {
        currNode.value = node;
        const nodeData = node ? node.data : {
            id: 0,
            name: '--'
        };
        formDialog.values = {
            id: 0,
            name: '',
            type: '',
            urlcode: '',
            perms: '',
            permsLevel: '',
            pid: nodeData.id,
            pName: nodeData.name
        };
        formDialog.visible = true;

    }

    // 编辑表单弹框 - 显示
    const editFormShow = async (node: Node): Promise<void> => {
        currNode.value = node;
        const nodeData = node.data;
        formDialog.values = {
            id: nodeData.id,
            name: nodeData.name,
            type: nodeData.type,
            urlcode: nodeData.urlcode,
            perms: nodeData.perms,
            permsLevel: nodeData.permsLevel,
            pid: nodeData.pid,
            pName: node.level === 1 ? '--' : node.parent.data.name
        };
        formDialog.visible = true;
    }



</script>
<template>
    <screen-tree-table
        ref="tableRef"
        v-loading="tableProp.loading"
        :operation-text="t('views.system.menulist.table.column.action')"
        :operation-width="300"
        :column="tableProp.column"
        node-key="id"
        :lazy="true"
        :load="loadNode"
        >
        <template #header>
           <el-row>
                    <el-col :span="24">
                        <el-button type="primary"  @click="addFormShow()" >{{t('views.system.menulist.button.add')}}</el-button>
                    </el-col>
                </el-row>
        </template>
        <template #column="{ data, item }">
            <template v-if="item.label==='type'">
                <span v-if="data[item.label]===1">{{t('components.custom.menutypeselect.text.menu')}}</span>
                <span v-else-if="data[item.label]===2">{{t('components.custom.menutypeselect.text.button')}}</span>
                <span v-else>--</span>
            </template>
            <template v-else>
                {{ data[item.label]}}
            </template>
        </template>
        <template #default="{ node, data }">
            <el-button
                type="primary" size="small" text
                @click.stop="addFormShow(node)"
                >
                {{t('views.system.menulist.table.column.action.buttion.add')}}
            </el-button>
            <el-button
                type="primary" size="small" text
                @click.stop="editFormShow(node)"
                >
                {{t('views.system.menulist.table.column.action.buttion.edit')}}
            </el-button>
            <el-popconfirm :title="t('views.system.menulist.table.column.action.buttion.del.popconfirm')" @confirm="handleDelete(node)">
                <template #reference>
                    <el-button type="primary" size="small" text :loading="data.delLoading" @click.stop>{{t('views.system.menulist.table.column.action.buttion.del')}}</el-button>
                </template>
            </el-popconfirm>
        </template>

    </screen-tree-table>

    <form-dialog
        v-if="formDialog.visible"
        ref="formDialogRef"
        :title="formDialog.values.id > 0?t('views.system.menulist.components.formdialog.edit.title'):t('views.system.menulist.components.formdialog.add.title')"
        v-model="formDialog.visible"
        v-model:submitLoading="formDialog.submitLoading"
        :values="formDialog.values"
        :onSubmit="formDialog.onSubmit"
    />

</template>
