/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！
import { request } from '@umijs/max';
import { message } from "antd";
import cookie from 'react-cookies'

export async function register(body: API.registerInfo) {
  console.log("注册",body)
  return request<any>('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function login(body: API.loginInfo) {
  console.log("登录",body)
  return request<any>('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function logout() {
  console.log("登出")
  message.success('退出成功')
}

export async function changePassword(body: API.changePasswordInfo) {
  console.log("修改密码",body)
  return request<any>('/api/changePassword', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function createProduct(body: API.createProductInfo) {
  console.log("创建商品",body)
  return request<any>('/api/createProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function modifyProduct(body: API.modifyProductInfo) {
  console.log("修改商品",body)
  return request<any>('/api/modifyProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function recharge(body: API.rechargeInfo) {
  console.log("充值",body)
  return request<any>('/api/recharge', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function listProduct(body: API.listProductInfo) {
  console.log("商品列表",body)
  return request<any>('/api/listProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function buyProduct(body: API.buyProductInfo) {
  console.log("购买商品",body)
  return request<any>('/api/buyProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}

export async function listMyProduct(body: API.listMyProductInfo) {
  console.log("我的商品",body)
  return request<any>('/api/listMyProduct', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    data: body,
  });
}