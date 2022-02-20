import request from '@/utils/request';
import { DataItem } from './data.d';

/**
 * 随笔管理 - 编辑
 * @param id ID
 * @param data 请求参数
 * @returns 
 * @author LiQingSong
 */
export async function articleEdit(id:number, data?: DataItem): Promise<any> {
  return request({
    url: '/articles/' + id,
    method: 'put',
    data
  });
}


/**
 * 随笔管理 - 获取指定随笔
 * @param id ID
 * @returns 
 * @author LiQingSong
 */
export async function articleDetail(id: number): Promise<any> {
  return request({
    url: '/articles/' + id,
    method: 'get'
  });
}


