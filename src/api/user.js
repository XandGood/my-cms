import request from '@/utils/request'

// 获取用户列表
export function getUser() {
  return request({
    url: '/users',
    method: 'get',
  })
}

export function getUserById(id) {
  return request({
    url: `/users/${id}`,
    method: 'get',
  })
}

export function updateUser(data) {
  return request({
    url: `/users/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteUser(id) {
  return request({
    url: `/users/${id}`,
    method: 'delete',
  })
}

export function getUserByPage(Page, Size) {
  return request({
    url: `/users?_page=${Page}&_limit=${Size}`,
    method: 'get',
  })
}

export function searchUser(keyword) {
  return request({
    url: `/users?q=${keyword}`,
    method: 'get',
  })
}