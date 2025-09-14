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
