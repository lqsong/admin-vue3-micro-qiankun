import request from '@/utils/request';

export async function queryList(keywords: string): Promise<any> {
  return request({
    url: '/tags/search',
    method: 'get',
    params: {
      keywords
    }
  });
}


