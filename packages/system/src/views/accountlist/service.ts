import request from '@/utils/request';
import { TableListQueryParams } from './data.d';
import { DataItem } from "./components/FormDialog/data.d";

/**
 * 账号 - 列表 - 有分页
 * @param params 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/accounts',
    method: 'get',
    params,
  });
}

/**
 * 账号 - 删除
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/accounts/${id}`, 
    method: 'delete',
  });
}



/**
 * 账号 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
 export async function accountAdd(data: DataItem): Promise<any> {
  return request({
    url: '/accounts',
    method: 'post',
    data
  });
}

/**
 * 账号 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export async function accountEdit(id: number, data: DataItem): Promise<any> {
  return request({
    url: `/accounts/${id}`, 
    method: 'put',
    data
  });
}


/**
 * 账号 - 获取指定详情
 * @param {Number} id ID
 * @author LiQingSong
 */
 export async function detailData(id: number): Promise<any> {
  return request({
    url: `/accounts/${id}`, 
    method: 'get'
  });
}
