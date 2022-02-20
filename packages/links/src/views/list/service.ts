import request from '@/utils/request';
import { TableListQueryParams } from './data.d';
import { DataItem } from "./components/FormDialog/data.d";

/**
 * 左邻右舍 - 列表 - 有分页
 * @param params 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function queryList(params?: TableListQueryParams): Promise<any> {
  return request({
    url: '/links',
    method: 'get',
    params,
  });
}

/**
 * 左邻右舍 - 删除
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/links/${id}`, 
    method: 'delete',
  });
}


/**
 * 左邻右舍 - 获取指定详情
 * @param {Number} id ID
 * @author LiQingSong
 */
export async function detailData(id: number): Promise<any> {
  return request({
    url: `/links/${id}`, 
    method: 'get'
  });
}


/**
 * 左邻右舍 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
 export async function linksAdd(data: DataItem): Promise<any> {
  return request({
    url: '/links',
    method: 'post',
    data
  });
}

/**
 * 左邻右舍 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export async function linksEdit(id: number, data: DataItem): Promise<any> {
  return request({
    url: `/links/${id}`, 
    method: 'put',
    data
  });
}
