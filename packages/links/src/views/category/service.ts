import request from '@/utils/request';
import { DataItem } from "./components/FormDialog/data.d";

/**
 * 左邻右舍 - 分类 - 列表 - 有分页
 * @param params 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function queryList(): Promise<any> {
  return request({
    url: '/link/categorys',
    method: 'get',
  });
}

/**
 * 左邻右舍 - 分类 - 删除
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function removeData(id: number): Promise<any> {
  return request({
    url: `/link/categorys/${id}`, 
    method: 'delete',
  });
}




/**
 * 左邻右舍 - 分类 - 新增
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
 export async function categoryAdd(data: DataItem): Promise<any> {
  return request({
    url: '/link/categorys',
    method: 'post',
    data
  });
}

/**
 * 左邻右舍 - 分类 - 编辑
 * @param {Number} id ID
 * @param {Object} data 请求参数
 * @author LiQingSong
 */
export async function categoryEdit(id: number, data: DataItem): Promise<any> {
  return request({
    url: `/link/categorys/${id}`, 
    method: 'put',
    data
  });
}
