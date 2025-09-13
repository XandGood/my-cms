export default [

  {
    path: '/auth',
    component: () => import('@/components/layout/SimpleLayout.vue'),
    children:[
      {
        path: 'login',
        name: 'Login',
        component: () => import('@/views/login/LoginPage.vue'),
        meta: { requireAuth: false }
      },
      {
        path:'register',
        name:'Register',
        component: () => import('@/views/login/RegisterPage.vue'),
        meta: { requireAuth: false }
      },
    ]
  },
  {
    path: '/',
    component: () => import('@/components/layout/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/home/HomePage.vue'),
        meta: { requireAuth: true }
      }
    ]
  }
]