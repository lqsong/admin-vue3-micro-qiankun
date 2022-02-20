import request from '@/utils/request';
import { DataItemParam } from "./data.d";


export async function queryList(pid: number): Promise<any> {
  return request({
    url: '/article/categorys',
    method: 'get',
    params: {
      pid
    }
  });
}

export async function add(data: DataItemParam): Promise<any> {
  return request({
    url: '/article/categorys',
    method: 'post',
    data
  });
}

export async function edit(id: number,data: DataItemParam): Promise<any> {
  return request({
    url: '/article/categorys/' + id,
    method: 'put',
    data
  });
}

export async function remove(id: number): Promise<any> {
  return request({
    url: '/article/categorys/' + id,
    method: 'delete'
  });
}


