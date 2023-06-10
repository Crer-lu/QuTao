import { defineConfig } from '@umijs/max';

export default defineConfig({
  antd: {},
  access: {},
  model: {},
  initialState: {},
  request: {},
  layout: {
    title: '图书管理系统',
  },
  routes: [
    {
      path: '/',
      redirect: '/home',
    },
    {
      name: '首页',
      path: '/home',
      component: './Home',
    },
    {
      name: '产品',
      path: '/product',
      component: './Product',
    },
    {
      name: '我的产品',
      path: '/myproduct',
      component: './MyProduct',
    },
    {
      name: '个人信息',
      path: '/info',
      component: './Info',
    },
    {
      name: '登出',
      path: '/logout',
      component: './Logout',
    },
    {
      path: '/register',
      component: './Register',
      menuRender: false,
    },
    {
      path: '/login',
      component: './Login',
      menuRender: false,
    },
  ],
  npmClient: 'npm',
  proxy: {
    '/api': {
      target: 'http://localhost:8080',
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
      secure: false,
    },
  },
});
