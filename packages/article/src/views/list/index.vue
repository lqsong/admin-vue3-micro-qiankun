<script lang="ts" setup>
    import { DefineComponent, reactive, ref, watchEffect } from "vue";
    import { useI18n } from "vue-i18n";
    import { ElMessage } from "element-plus";
    import IconSvg from "@/components/IconSvg";
    import ALink from '@/components/ALink/index.vue';
    import ScreenTable from '@/components/ScreenTable/index.vue';
    import SearchDrawer from './components/SearchDrawer/index.vue';
    import { SearchProps, SearchFormItem } from "./components/SearchDrawer/data.d";
    import { TableDataType, TableListItem, TableListQueryParams } from "./data.d";
    import useQueryList from '@/composables/useQueryList'
    import { trimComma } from "@/utils/trim";
    import { ResponseData } from '@/utils/request';
    import { queryList, removeData } from "./service";

    const { t } = useI18n();


    // 列表 - 初始化数据
    const tableData = reactive<TableDataType>({
        loading: false,
        list: [],
        pagination: {
            total: 0,
            current: 1,
            pageSize: 0,
            sizeChange:()=>{},
            onChange: () => {}
        }
    })
    // 列表 - 获取数据
    const { pushQuery, queryParams } =  useQueryList<TableListQueryParams>('/list', async (queryParams, pushQuery): Promise<void> => {
        tableData.loading = true;
        const response: ResponseData = await queryList(queryParams);

        const { data } = response;
        const list: TableListItem[]  = data.list || [];
        tableData.list =  list.map(item=> {
            item.tag = trimComma(item.tag);
            item.tags = item.tag!=='' ? item.tag.split(',') : [];
            return item;
        })
        tableData.pagination = {
            total: data.total || 0,
            current: queryParams.page,
            pageSize: queryParams.per,
            sizeChange: (size) => pushQuery({per: size, page: 1}),
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
    const miniSearchBtn = (): void => {
        pushQuery({
            keywords: miniSearchInput.value,
            categoryid: '',
            addtimestart: '',
            addtimeend: '',
            tags: '',
            page: 1
        })
    }


    // 动态搜索赋值
    watchEffect(()=> {
        const category: number[] = [];
        if(queryParams.value.categoryid) {
            queryParams.value.categoryid.split(',').map(item => {
                if(item) {
                    category.push(Number(item))
                }
            })
        }
        const params: SearchFormItem = {
            keywords: queryParams.value.keywords || '',
            category,
            addtime: queryParams.value.addtimestart && queryParams.value.addtimeend ? [queryParams.value.addtimestart, queryParams.value.addtimeend] : [],
            tags: queryParams.value.tags? queryParams.value.tags.split(',') : []
        }
        miniSearchInput.value = params.keywords;
        searchDrawerRef.value?.setModelRef({...params})
    })


    // 删除
    const handleDelete = async (index:number, row: TableListItem): Promise<void> => {

        tableData.list[index]['delLoading'] = true;
        try {
            await removeData(row.id)
            ElMessage.success(t('views.article.list.table.column.action.buttion.del.success'));
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
             ElMessage.warning(error.msg || error || 'error');
             tableData.list[index]['delLoading'] = false;
        }


    }



</script>
<template>

    <screen-table
        row-key="id"
        :data="tableData.list"
        :loading="tableData.loading"
        :pagination="tableData.pagination"
    >

        <template #header>
            <el-row>
                    <el-col :span="8">
                        <a-link to="/add">
                            <el-button type="primary"> {{t('views.article.list.button.add')}}</el-button>
                        </a-link>
                    </el-col>
                    <el-col :span="16" class="text-align-right">
                        <el-input style="width:200px;" :placeholder="t('views.article.list.search.input.placeholder')" v-model="miniSearchInput"  @keydown.enter="miniSearchBtn">
                            <template #suffix>
                                <i class="el-input__icon"><icon-svg type="search" class="cursor-pointer" @click="miniSearchBtn"></icon-svg></i>
                            </template>
                        </el-input>
                        <el-button style="margin-left: 8px" @click="() => searchDrawer.visible = true">{{t('views.article.list.button.search')}}</el-button>
                    </el-col>
            </el-row>
        </template>


        <el-table-column
            fixed
            type="index"
            :label="t('views.article.list.table.column.index')"
            width="80">
        </el-table-column>

        <el-table-column
            fixed
            :label="t('views.article.list.table.column.title')"
            prop="title"
            min-width="330">
        </el-table-column>
        <el-table-column
            :label="t('views.article.list.table.column.category')"
            min-width="100">
            <template #default="{row}">
                {{ row.category.name }}
            </template>
        </el-table-column>

        <el-table-column
            prop="addtime"
            :label="t('views.article.list.table.column.addtime')"
            width="180">
        </el-table-column>
        <el-table-column
            :label="t('views.article.list.table.column.tags')"
            width="130">
            <template #default="{row}">
                <el-tag v-for="item in row.tags" :key="item">{{ item }}</el-tag>
            </template>
        </el-table-column>

        <el-table-column
            :label="t('views.article.list.table.column.action')"
            prop="action"
            width="160">
            <template #default="{row,$index}">
                <a-link :to="`/edit?id=${row.id}`">
                 <el-button type="primary" text size="small">{{t('views.article.list.table.column.action.buttion.edit')}}</el-button>
                </a-link>
                <el-popconfirm :title="t('views.article.list.table.column.action.buttion.del.popconfirm')" @confirm="handleDelete($index, row)">
                    <template #reference>
                        <el-button type="primary" text  size="small" :loading="row.delLoading" >{{t('views.article.list.table.column.action.buttion.del')}}</el-button>
                    </template>
                </el-popconfirm>
            </template>
        </el-table-column>


    </screen-table>


     <search-drawer
        ref="searchDrawerRef"
        v-model="searchDrawer.visible"
        :title="t('views.article.list.components.search.title')"
        :onReset="searchDrawer.onReset"
        :onSubmit="searchDrawer.onSubmit"
    />



</template>


