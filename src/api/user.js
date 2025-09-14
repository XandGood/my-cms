import request from '@/utils/request'

// 获取用户列表
export function getUser() {
  return request({
    url: '/users',
    method: 'get',
  })
}