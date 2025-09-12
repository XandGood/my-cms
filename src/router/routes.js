export default [
  {
    path: '/login',
    name: 'Login',
    component: () => import('@/views/LoginPage.vue'),
    meta: { requireAuth: false }
  },
    //   {
    //     path: '',
    //     name: 'Dashboard',
    //     component: () => import('@/views/dashboard/Dashboard.vue')
    //   },
    //   {
    //     path: 'articles',
    //     name: 'ArticleList',
    //     component: () => import('@/views/articles/ArticleList.vue')
    //   },
    //   {
    //     path: 'articles/create',
    //     name: 'ArticleCreate',
    //     component: () => import('@/views/articles/ArticleEdit.vue')
    //   },
    //   {
    //     path: 'articles/:id/edit',
    //     name: 'ArticleEdit',
    //     component: () => import('@/views/articles/ArticleEdit.vue')
    //   },
    //   {
    //     path: 'users',
    //     name: 'UserList',
    //     component: () => import('@/views/users/UserList.vue')
    //   },
    //   {
    //     path: 'settings',
    //     name: 'Settings',
    //     component: () => import('@/views/settings/Settings.vue')
    //   }
  //   ]
  // }
]