import request from '@/utils/request';

export async function queryList(pid: number): Promise<any> {
  return request({
    url: '/article/categorys/cascader',
    method: 'get',
    params: {
        pid
      }
  });
}


