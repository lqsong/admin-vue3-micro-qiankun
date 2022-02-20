import request from '@/utils/request';
import { TableListQueryParams } from './data.d';

export async function linksHitQueryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/links',
    method: 'get',
    params,
  });
}

