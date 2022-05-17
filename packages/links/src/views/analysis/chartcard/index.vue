<template>
      <a-card class="homeBoxCard" :title="t('page.analysis.chartcard.linkschartcard.card-title')">
          <template #extra>
            <a-tag color="orange">{{t('page.analysis.chartcard.text-years')}}</a-tag>
          </template>
          <div class="num">{{num.toLocaleString()}}</div>
          <div class="height40" ref="linksChartRef"></div>
          <a-divider />
          <a-row>
            <a-col :span="12">{{t('page.analysis.chartcard.text-total')}}</a-col>
            <a-col class="text-align-right" :span="12">
              {{total.toLocaleString()}}
            </a-col>
          </a-row>
      </a-card>
</template>
<script lang="ts" setup>
import { computed, onMounted, ref, reactive, watch } from "vue";
import { useI18n } from "vue-i18n";
import useEcharts, { EChartsOption } from '@/composables/useEcharts';
import { LinksChartDataType, ChartDataType } from "./data.d";
import { ResponseData } from '@/utils/request';
import { annualnewLinks } from "./service";

const linksChartOption: EChartsOption = {
  tooltip: {
  },
  grid: {
    left: '0',
    right: '0',
    top: '0',
    bottom: '0',
  },
  xAxis: {
    show: false,
    data: [
      /* '2019-04', '2019-05', '2019-06','2019-07', '2019-08', '2019-09', '2019-10', '2019-11', '2019-12', '2020-01', '2020-02', '2020-03' */
    ],
  },
  yAxis: {
    show: false,
  },
  series: [
    {
      name: '新增',
      type: 'bar',
      data: [
        /* 5888, 3838, 15880, 12888, 18888, 16888,5888, 3838, 15880, 12888, 18888, 16888 */
      ],
    },
  ],
};

const { t } = useI18n();

// 数据
const visitData = reactive<LinksChartDataType>({
  total: 0,
  num: 0,
  chart: {
    day: [],
    num: [],
  }
});


// 读取数据 func
const loading = ref<boolean>(true);
const getData = async () => {
    loading.value = true;
    const response: ResponseData = await annualnewLinks();
    const { data } = response;
    visitData.total = data.total || 0;
    visitData.num = data.num || 0;
    visitData.chart = data.chart || {
      day: [],
      num: [],
    }
    loading.value = false;
}

onMounted(()=> {
    getData();
})


// 总数
const total = computed<number>(() => visitData.total);
// num
const num = computed<number>(() => visitData.num);
// chart Data
const chartData = computed<ChartDataType>(()=> visitData.chart);




// echarts 图表
const linksChartRef = ref<HTMLDivElement>();
const echarts = useEcharts(linksChartRef, linksChartOption);
watch([echarts, chartData],()=> {
  if(echarts.value) {
      const option: EChartsOption = {
        xAxis: {
          // data: ["03-01", "03-01", "03-01", "03-01", "03-01", "03-01", "03-01"]
          data: chartData.value.day,
        },
        series: [
          {
            name: '新增',
            // data: [3, 1, 1, 2, 2, 2, 2]
            data: chartData.value.num,
          },
        ],
      };
      echarts.value.setOption(option);
  }
});

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
  .num {
    font-size: 30px;
    color: #515a6e;
  }
  .height40 {
    height: 40px;
  }
}
</style>
