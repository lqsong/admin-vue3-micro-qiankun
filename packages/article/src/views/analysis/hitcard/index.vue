<template>
    <el-card shadow="never" class="cus-card homeBoxCard">
        <template #header>
            <span>{{t('page.analysis.articlehitcard.card-title')}}</span>
        </template>

        <el-table
          size="small"
          row-key="id"
          header-row-class-name="custom-table-header"
          stripe
          v-loading="loading"
          :data="list"
        >

            <el-table-column
              type="index"
              :label="t('page.analysis.articlehitcard.card.table-column-number')"
              :index="indexMethod"
              width="80">
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="title"
              :label="t('page.analysis.articlehitcard.card.table-column-title')"
              >
            </el-table-column>
            <el-table-column
              show-overflow-tooltip
              prop="hit"
              width="100"
              :label="t('page.analysis.articlehitcard.card.table-column-hit')"
              >
            </el-table-column>

        </el-table>

        <div class="text-align-right padding-t10">
            <el-pagination
              small
              layout="prev, pager, next"
              v-model:current-page="pagination.current"
              :page-size="pagination.pageSize"
              :total="pagination.total"
              @current-change="(p) => {
                getList(p || 1);
              }">
            </el-pagination>
        </div>


    </el-card>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, reactive } from "vue";
import { useI18n } from "vue-i18n";
import { ArticleHitDataType, PaginationConfig, TableListItem } from "./data";
import { ResponseData } from '@/utils/request';
import { articleHitQueryList } from "./service";

const { t } = useI18n();

// 数据
const visitData = reactive<ArticleHitDataType>({
  list: [],
  pagination: {
    total: 0,
    current: 1,
    pageSize: 5,
    showSizeChanger: false,
  },
});

// 分页
const pagination = computed<PaginationConfig>(()=> visitData.pagination);

// 数据
const list = computed<TableListItem[]>(()=> visitData.list);

// 表格索引
const indexMethod = (index: number) => {
  return (pagination.value.current - 1) * pagination.value.pageSize + index + 1;
}


// 读取数据 func
const loading = ref<boolean>(true);
const getList = async (current: number): Promise<void> => {
    loading.value = true;
    const response: ResponseData = await articleHitQueryList();
    const { data } = response;

    visitData.list= data.list || [];
    visitData.pagination ={
      ...visitData.pagination,
      current: current,
      total: data.total || 0
    }

    loading.value = false;
}

onMounted(()=> {
    getList(1);
})

</script>
<style lang="scss" scoped>
.homeBoxCard {
  margin-bottom: 24px;
  ::v-deep(.el-card__header) {
    padding-left: 12px;
    padding-right: 12px;
  }
  ::v-deep(.el-card__body) {
    padding: 12px;
    font-size: 14px;
    line-height: 1.5715;
  }
  ::v-deep(.el-divider) {
    margin: 8px 0;
  }
}
</style>
