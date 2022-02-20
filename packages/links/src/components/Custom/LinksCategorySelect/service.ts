import request from '@/utils/request';

export async function queryList(): Promise<any> {
  return request({
    url: '/link/categorys',
    method: 'get',
    params: {}
  });
}


