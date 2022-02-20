<template>
      <a-card class="homeBoxCard" :title="t('page.analysis.linkshitcard.card-title')">
        <a-table
          size="small"
          row-key="id"
          :columns="columns"
          :dataSource="list"
          :loading="loading"
          :pagination="pagination"
          stripe
        >
        <template #category="{ record }">
             {{ record.category.name }}
        </template>
        </a-table>
      </a-card>
</template>
<script lang="ts" setup>
  import { reactive, ref, computed, onMounted } from "vue";
  import { useI18n } from "vue-i18n";
  import { ResponseData } from '@/utils/request';
  import { LinksHitDataType, PaginationConfig, TableListItem } from "./data.d";
  import { linksHitQueryList } from "./service";



  const { t } = useI18n();
  const visitData = reactive<LinksHitDataType>({
      list: [],
      columns: [
        {
          title: t('page.analysis.linkshitcard.card.table-column-number'),
          dataIndex: 'index',
          width: 80,
          customRender: ({text, index}: { text: any; index: number}) => {
            return (visitData.pagination.current - 1) * visitData.pagination.pageSize + index + 1;
          },
        },
        {
          title: t('page.analysis.linkshitcard.card.table-column-title'),
          dataIndex: 'title',
        },
        {
          title: t('page.analysis.linkshitcard.card.table-column-category'),
          dataIndex: 'category',
          slots: { customRender: 'category' },
        },

      ],
      pagination: {
          total: 0,
          current: 1,
          pageSize: 20,
          showSizeChanger: false,
          showQuickJumper: false,
          onChange: () => {},
          showSizeChange: () => {}
      }
  })

  // 分页
  const pagination = computed<PaginationConfig>(()=> visitData.pagination);

  //
  const columns = computed<PaginationConfig>(()=> visitData.columns);

  // 数据
  const list = computed<TableListItem[]>(()=> visitData.list);

  // 读取数据 func
  const loading = ref<boolean>(true);
  const getList = async (current: number): Promise<void> => {
      loading.value = true;
      const response: ResponseData = await linksHitQueryList();
      const { data } = response;

      visitData.list= data.list || [];
      visitData.pagination ={
        ...visitData.pagination,
        current: current,
        total: data.total || 0,
        onChange: (page) => getList(page || 1)
      }

      loading.value = false;
  }

  onMounted(()=> {
    getList(1);
  })


</script>
<style lang="less" scoped>
.homeBoxCard {
  margin-bottom: 24px;
  ::v-deep(.ant-card-head) {
    padding-left: 12px;
    padding-right: 12px;
    font-size: 14px;
  }
  ::v-deep(.ant-card-body) {
    padding: 12px;
    font-size: 14px;
    line-height: 1.5715;
  }
  ::v-deep(.ant-divider) {
    margin: 8px 0;
  }
}
</style>
