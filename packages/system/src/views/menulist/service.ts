import request from '@/utils/request';
import { DataItem } from "./components/FormDialog/data.d";


/**
 * 后台菜单 - 列表
 * @param pid number 父id
 * @returns 
 * @author LiQingSong
 */
export async function queryList(pid: number): Promise<any> {
  return request({
    url: '/menus',
    method: 'get',
    params: {
      pid
    }
  });
}

/**
 * 后台菜单 - 添加
 * @param {DataItem} data  请求参数
 * @returns 
 * @author LiQingSong
 */
export async function add(data: DataItem): Promise<any> {
  return request({
    url: '/menus',
    method: 'post',
    data
  });
}

/**
 * 后台菜单 - 编辑
 * @param {number} id ID
 * @param {DataItem} data  请求参数
 * @returns 
 * @author LiQingSong
 */
export async function edit(id: number,data: DataItem): Promise<any> {
  return request({
    url: '/menus/' + id,
    method: 'put',
    data
  });
}

/**
 * 后台菜单 - 删除
 * @param {number} id ID 
 * @returns
 * @author LiQingSong
 */
export async function remove(id: number): Promise<any> {
  return request({
    url: '/menus/' + id,
    method: 'delete'
  });
}


