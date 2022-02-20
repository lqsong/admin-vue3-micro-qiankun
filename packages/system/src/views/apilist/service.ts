import request from '@/utils/request';
import { DataItem } from "./components/FormDialog/data.d";


/**
 * API管理 - 列表
 * @param pid number 父id
 * @returns
 * @author LiQingSong
 */
export async function queryList(pid: number): Promise<any> {
  return request({
    url: '/apis',
    method: 'get',
    params: {
      pid
    }
  });
}

/**
 * API管理 - 添加
 * @param {DataItem} data  请求参数
 * @returns
 * @author LiQingSong
 */
export async function add(data: DataItem): Promise<any> {
  return request({
    url: '/apis',
    method: 'post',
    data
  });
}

/**
 * API管理 - 编辑
 * @param {number} id ID
 * @param {DataItem} data  请求参数
 * @returns
 * @author LiQingSong
 */
export async function edit(id: number,data: DataItem): Promise<any> {
  return request({
    url: '/apis/' + id,
    method: 'put',
    data
  });
}

/**
 * API管理 - 删除
 * @param {number} id ID
 * @returns
 * @author LiQingSong
 */
export async function remove(id: number): Promise<any> {
  return request({
    url: '/apis/' + id,
    method: 'delete'
  });
}


