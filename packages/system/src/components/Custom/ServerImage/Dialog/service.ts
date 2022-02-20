import request from '@/utils/request';
import { TableListQueryParams  } from "./data.d";

export const uploadUrl: string =  process.env.VUE_APP_APIHOST + '/upload/images';

export async function queryList(params: TableListQueryParams): Promise<any> {
  return request({
    url: '/upload/images',
    method: 'get',
    params
  });
}


