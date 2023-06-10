/* eslint-disable */
// 该文件由 OneAPI 自动生成，请勿手动修改！

declare namespace API {

  interface registerInfo {
    username: string;
    password: string;
  }

  interface changePasswordInfo {
    username: string;
    oldPassword: string;
    newPassword: string;
  }

  interface loginInfo {
    username: string;
    password: string;
  }

  interface createProductInfo {
    username: string;
    url: string;
    price: number;
    allowance: number;
    name: string;
    description: string;
  }

  interface modifyProductInfo {
    username: string;
    productId: number;
    url: string;
    price: number;
    allowance: number;
    name: string;
    description: string;
  }

  interface rechargeInfo {
    username: string;
    amount: number;
  }
  // TODO: 修改接口
  // interface listProductInfo {
  //   message: string;
  // }
  interface listProductInfo {
    message: string;
  }
  
  interface listMyProductInfo {
    username: string;
  }

  interface buyProductInfo {
    username: string;
    productId: number;
    times: number;
  }

  interface productInfo {
    id: number;
    url: string;
    price: number;
    owner: string;
    name: string;
    description: string;
    allowance: number;
  }


}
