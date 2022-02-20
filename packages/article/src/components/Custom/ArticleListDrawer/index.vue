<script lang="ts">
import RestElDrawer from "@/components/RestElDrawer/index.vue";
import { ResponseData } from '@/utils/request';
import { queryList } from "./service";
import { defineComponent, computed, reactive, ref, watch } from "vue";
import { useI18n } from "vue-i18n";
export default defineComponent({
    name: 'ArticleListDrawer',
    components: {
        RestElDrawer
    },
    props: {
        modelValue: {
            type: Boolean,
            required: true
        },
        title: {
            type: String,
            default: 'article list'
        },
        size: {
            type: String,
            default: '80%'
        },
    },
    emits: ['update:modelValue'],
    setup(props, { emit }) {
        const { t } = useI18n();

        const visible = computed<boolean>({
            get: () => props.modelValue,
            set: val => {
                emit('update:modelValue', val);
            }
        });

        const tableData = reactive({
            tableIndexMethod(index) {
                return index + (tableData.pagination.current - 1) * tableData.pagination.pageSize + 1;
            },
            loading: false,
            list: [],
            pagination: {
                total: 0,
                current: 1,
                pageSize: 20,
                onChange: (page: number) => {}
            }
        });

        const handleCurrentChange = async (current: number) => {
            tableData.loading = true;
            searchVal.original = searchVal.copy;
            const response: ResponseData =  await queryList({page: current, per: tableData.pagination.pageSize, keywords: searchVal.original});
            const { data } = response;
            const list = data.list || [];
            tableData.list =  list.map(item=> {
                return {
                    id: item.id,
                    title: item.title,
                    addtime: item.addtime,
                    category: item.category
                };
            });
            tableData.pagination = {
                total: data.total || 0,
                current: current,
                pageSize: 20,
                onChange: (page: number) => {handleCurrentChange(page)}
            }       
            tableData.loading = false;
        }
        watch(visible ,(value)=> {
            if(value) {
                handleCurrentChange(1);
            }
        })

        const searchVal = reactive({
            original: '',
            copy: ''
        });
        const handleSearch = () =>  {
            searchVal.copy = searchVal.original;
            handleCurrentChange(1);
        }


        return  {
            visible,
            tableData,
            searchVal,
            handleSearch,
            t          
        }

    }
})
</script>
<template>
    <rest-el-drawer
      :size="size"
      :title="title"
      v-model="visible"
    >
        
       <el-form :inline="true">
            <el-form-item :label="t('components.custom.articlelistdrawer.form.title')">
                <el-input v-model="searchVal.original" 
                    :placeholder="t('components.custom.articlelistdrawer.form.title.placeholder')" class="width-200" 
                    clearable @keydown.enter="handleSearch">
                </el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="handleSearch">{{t('components.custom.articlelistdrawer.form.btn.search')}}</el-button>
            </el-form-item>
        </el-form>

        <el-table
            header-row-class-name="custom-table-header"
            border
            stripe
            v-loading="tableData.loading"
            :data="tableData.list">
            <el-table-column
                type="index"
                :label="t('components.custom.articlelistdrawer.table.column.index')"
                width="80"
                :index="tableData.tableIndexMethod">
            </el-table-column>
            <el-table-column
                prop="title"
                :label="t('components.custom.articlelistdrawer.table.column.title')"
                min-width="260">
            </el-table-column>
            <el-table-column
                :label="t('components.custom.articlelistdrawer.table.column.category')"
                min-width="100">
                <template  #default="scope">
                    {{ scope.row.category.name }}                            
                </template>
            </el-table-column>
            <el-table-column
                prop="addtime"
                :label="t('components.custom.articlelistdrawer.table.column.addtime')"
                min-width="140">
            </el-table-column>

            <slot name="el-table-column"></slot>   

        </el-table>


        <template #footer>
            <el-pagination 
                background
                layout="total, prev, pager, next"
                :current-page="tableData.pagination.current"
                :page-size="tableData.pagination.pageSize"
                :total="tableData.pagination.total"
                @current-change="tableData.pagination.onChange">
            </el-pagination>
        </template>

      
    </rest-el-drawer>
</template>
<style lang="scss" scoped>
</style>