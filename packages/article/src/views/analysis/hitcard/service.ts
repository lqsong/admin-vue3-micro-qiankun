import request from '@/utils/request';
import { TableListQueryParams } from './data.d';

export async function articleHitQueryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/articles',
    method: 'get',
    params,
  });
}
