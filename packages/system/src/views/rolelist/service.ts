import request from '@/utils/request';
import { DataItem } from "./components/FormDialog/data.d";

/**
 * 角色 - 列表 - 有分页
 * @param params 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function queryList(): Promise<any> {
  return request({
    url: '/roles',
    method: 'get',
  });
}

/**
 * 角色 - 删除
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/roles/${id}`, 
    method: 'delete',
  });
}




/**
 * 角色 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
 export async function roleAdd(data: DataItem): Promise<any> {
  return request({
    url: '/roles',
    method: 'post',
    data
  });
}

/**
 * 角色 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export async function roleEdit(id: number, data: DataItem): Promise<any> {
  return request({
    url: `/roles/${id}`, 
    method: 'put',
    data
  });
}
