import request from '@/utils/request';

export async function annualnewLinks(): Promise<any> {
  return request({
      url: '/stats/links/annualnew',
      method: 'get'
  });
}
