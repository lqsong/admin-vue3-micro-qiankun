import request from '@/utils/request';

export async function queryList(): Promise<any> {
  return request({
    url: '/menus/all',
    method: 'get',
    params: {}
  });
}


