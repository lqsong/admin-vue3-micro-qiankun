import { RoutesDataItem } from "@/utils/routes";
import BlankLayout from '@/layouts/BlankLayout.vue';

const DashboardLayoutRoutes: Array<RoutesDataItem> = [
  {
    title: 'analysis',
    path: 'analysis',
    component: BlankLayout,
    children: [
      {
        title: 'chartcard',
        path: 'chartcard',
        component: ()=> import('@/views/analysis/chartcard/index.vue')
      },
      {
        title: 'hitcard',
        path: 'hitcard',
        component: ()=> import('@/views/analysis/hitcard/index.vue')
      }
    ]
  }
];

export default DashboardLayoutRoutes;
