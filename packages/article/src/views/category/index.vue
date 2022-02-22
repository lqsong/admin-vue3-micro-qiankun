<script lang="ts" setup>
    import ScreenTreeTable from '@/components/ScreenTreeTable/index.vue';
    import { ResponseData } from '@/utils/request';
    import { tablePropType } from "./data.d";
    import { queryList, add, edit, remove } from './service';
    import { DataItemParam } from './data.d'
    import { LoadFunction } from 'element-plus/es/components/tree/src/tree.type';
    import { ElMessage, ElForm } from "element-plus";
    import { useI18n } from "vue-i18n";
    import { reactive, ref, watch } from "vue";

    const { t, locale } = useI18n();

    const tableRef = ref();
    const tableProp = reactive<tablePropType>({
        loading: true,
        column: [
          {
              title: t('views.article.category.table.column.name'),
              label: 'name',
              minWidth: 300
          },
          {
              title: t('views.article.category.table.column.alias'),
              label: 'alias',
              minWidth: 300
          }
      ]

    })

    watch(locale, ()=> {
      tableProp.column = [
          {
              title: t('views.article.category.table.column.name'),
              label: 'name',
              minWidth: 300
          },
          {
              title: t('views.article.category.table.column.alias'),
              label: 'alias',
              minWidth: 300
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

    const dialogFormRef = ref<typeof ElForm>();
    const dialog = reactive<{
        visible: boolean;
        loading: boolean;
        form: any;
        rules: any;
    }>({
        visible: false,
        loading: false,
        form: {
            node: null,
            id: 0,
            name: '',
            alias: '',
            title: '',
            keywords: '',
            description: '',
            pid: 0,
            prename: '--'
        },
        rules: {
            name: [
                { required: true, message: t('views.article.category.form.name.placeholder'), trigger: 'blur' },
                { max: 8, message: t('views.article.category.form.name.max'), trigger: 'blur' }
            ],
            alias: [
                {
                    required: true,
                    validator: (rule, value, callback) => {
                        if (value === '') {
                            callback(new Error(t('views.article.category.form.alias.placeholder')));
                        } else if (!/^[a-z0-9]+$/.test(value)) {
                            callback(new Error(t('views.article.category.form.alias.test')));
                        } else if (value.length > 10) {
                            callback(new Error(t('views.article.category.form.alias.max')));
                        }else {
                            callback();
                        }
                    },
                    trigger: 'blur'
                }
            ],
            title: [
                { max: 30, message: t('views.article.category.form.title.max'), trigger: 'blur' }
            ],
            keywords: [
                { max: 50, message: t('views.article.category.form.keywords.max'), trigger: 'blur' }
            ],
            description: [
                { max: 100, message: t('views.article.category.form.description.max'), trigger: 'blur' }
            ]
        }
    })

    const showDialog = (type, node?:any) => {
        const nodeData = node ? node.data : {
            id: 0,
            name: '',
            alias: '',
            title: '',
            keywords: '',
            description: '',
            pid: 0
        }

        if(type==='add') {
            dialog.form = {
                node: node || null,
                id: 0,
                name: '',
                alias: '',
                title: '',
                keywords: '',
                description: '',
                pid: nodeData.id || 0,
                prename: nodeData.name || '--'
            }
        } else if(type==='edit') {
            dialog.form = {
                node: node,
                id: nodeData.id,
                name: nodeData.name,
                alias: nodeData.alias,
                title: nodeData.title,
                keywords: nodeData.keywords,
                description: nodeData.description,
                pid: nodeData.pid,
                prename: node.level === 1 ? '--' : node.parent.data.name
            }
        }

        dialog.visible = true;
    }

    const submitDialogForm = async () => {
        dialog.loading = true;
        try {
            const valid: boolean | undefined =  await dialogFormRef.value?.validate();
            if(valid === true) {
                const paramData: DataItemParam = {
                    name: dialog.form.name,
                    alias: dialog.form.alias,
                    title: dialog.form.title,
                    keywords: dialog.form.keywords,
                    description: dialog.form.description,
                    pid: dialog.form.pid
                };
                if(dialog.form.id < 1) {
                    const response: ResponseData = await add(paramData);
                    const { data } = response;
                    if(dialog.form.pid > 0) {
                        tableRef.value['elTree'].append(
                            {
                                ...paramData,
                                id: data.id || 0
                            },
                            dialog.form.node
                        );
                    } else {
                        tableRef.value['elTree'].append(
                            {
                                ...paramData,
                                id: data.id || 0
                            }
                        );
                    }

                } else {
                    await edit(dialog.form.id, paramData);
                    dialog.form.node.data = {
                        ...dialog.form.node.data,
                        ...paramData
                    }
                }

                ElMessage.success(t('views.article.category.form.action.success'));
                dialog.visible = false;

            }
        } catch (error) {
            console.log(error);
            ElMessage.warning(t('app.global.form.validatefields.catch'));
        }
        dialog.loading = false;

    }


    const handleDelete = async (node: any) => {
        node.data['delLoading'] = true;
        try {
            await remove(node.data.id)
            ElMessage.success(t('views.article.category.form.del.success'));
            tableRef.value['elTree'].remove(node);
        } catch (error: any) {
            ElMessage.warning(error.msg || error || 'error');
            node.data['delLoading'] = false;
        }
    }


</script>
<template>
    <screen-tree-table
        ref="tableRef"
        v-loading="tableProp.loading"
        :operation-text="t('views.article.category.table.column.action')"
        :column="tableProp.column"
        node-key="id"
        :lazy="true"
        :load="loadNode"
        >
        <template #header>
           <el-row>
                    <el-col :span="24">
                        <el-button type="primary" @click="showDialog('add')" >{{t('views.article.category.form.btn.add')}}</el-button>
                    </el-col>
                </el-row>
        </template>
        <template #default="{ node, data }">
            <el-button
                type="text"
                size="small"
                @click.stop="showDialog('add', node)">
                {{t('views.article.category.form.btn.add2')}}
            </el-button>
            <el-button
                type="text"
                size="small"
                @click.stop="showDialog('edit', node)">
                {{t('views.article.category.form.btn.edit')}}
            </el-button>
            <!-- <el-button
                type="text"
                size="small"
                @click.stop="handleDelete(node)">
                删除
            </el-button>  -->
            <el-popconfirm :title="t('views.article.category.form.btn.del.confirm')" @confirm="handleDelete(node)">
                <template #reference>
                    <el-button type="text" size="small" :loading="data.delLoading">{{t('views.article.category.form.btn.del')}}</el-button>
                </template>
            </el-popconfirm>
        </template>

    </screen-tree-table>

    <el-dialog
            :title="dialog.form.id < 1 ? t('views.article.category.form.dialog.add.title') : t('views.article.category.form.dialog.edit.title')"
            width="500px"
            :close-on-click-modal="false"
            v-model="dialog.visible">

                <el-form :model="dialog.form" :rules="dialog.rules" ref="dialogFormRef" label-width="130px" >
                    <el-form-item :label="t('views.article.category.form.name')" prop="name">
                        <el-input v-model.trim="dialog.form.name" :placeholder="t('views.article.category.form.name.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.article.category.form.alias')" prop="alias">
                        <el-input v-model.trim="dialog.form.alias" :placeholder="t('views.article.category.form.alias.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.article.category.form.title.placeholder')" prop="title">
                        <el-input v-model.trim="dialog.form.title" :placeholder="t('views.article.category.form.title.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.article.category.form.keywords')" prop="keywords">
                        <el-input v-model.trim="dialog.form.keywords" :placeholder="t('views.article.category.form.keywords.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.article.category.form.description')" prop="description">
                        <el-input v-model.trim="dialog.form.description" type="textarea" :placeholder="t('views.article.category.form.description.placeholder')" class="width-200"></el-input>
                    </el-form-item>
                    <el-form-item :label="t('views.article.category.form.prename')">
                        <el-input v-model.trim="dialog.form.prename" disabled class="width-200"></el-input>
                    </el-form-item>
                </el-form>

            <template  #footer>
                <el-button @click="dialog.visible = false">{{t('views.article.category.form.dialog.btn.cancel')}}</el-button>
                <el-button type="primary" @click="submitDialogForm()"  :loading="dialog.loading">{{t('views.article.category.form.dialog.btn.save')}}</el-button>
            </template>
        </el-dialog>
</template>
