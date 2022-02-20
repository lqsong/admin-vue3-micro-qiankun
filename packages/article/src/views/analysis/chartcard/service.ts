import request from '@/utils/request';

export async function dailynewArticles(): Promise<any> {
  return request({
      url: '/stats/articles/dailynew',
      method: 'get'
  });
}
