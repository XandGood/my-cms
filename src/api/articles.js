import request from '@/utils/request'


export function getArticles() {
    return request({
        url: '/articles',
        method: 'get'
    })
}

export function getArticlesByDateRange(startDate, endDate) {
  return request({
    url: '/articles',
    method: 'get',
    params: {
      createdAt_gte: startDate.toISOString(),
      createdAt_lte: endDate.toISOString()
    }
  })
}

export function getArticlesByPage(Page, Size, categoryId) {
  const params = {
    _page: Page,
    _limit: Size
  };
  if (categoryId) {
    params.categoryId = categoryId;
  }
  return request({
    url: '/articles',
    method: 'get',
    params
  })
}

export function addArticle(data) {
  return request({
    url: '/articles',
    method: 'post',
    data
  })
}

export function updateArticle(data) {
  return request({
    url: `/articles/${data.id}`,
    method: 'put',
    data
  })
}

export function deleteArticle(id) {
  return request({
    url: `/articles/${id}`,
    method: 'delete'
  })
}

export function getArticleById(id) {
  return request({
    url: `/articles/${id}`,
    method: 'get'
  })
}
