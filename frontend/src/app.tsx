// 运行时配置

import { RunTimeLayoutConfig } from '@umijs/max';
import img from "./assets\\b.png"
import { useModel } from 'umi';
// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<any> {
  return { 
    name: '区淘',
    // logout: () => <div>www</div>,
  };
}

export const layout = (initialState) => {

  // const { name } = useModel('user');
  const name = localStorage.getItem("name")
  
  return {
    // title: "wwww",
    // logo: 'https://img.alicdn.com/tfs/TB1YHEpwUT1gK0jSZFhXXaAtVXa-28-27.svg',
    logo: <img src={img} />,
    menu: {
      locale: false,
    },

    // headerRender : () => <div>w21313221ww</div>,
    //fixedHeader: true,
    // footerRender: () => <div>www</div>,
    // menuHeaderRender:  () => <div>www</div>,
    menuFooterRender:  () => {
      console.log("name:",name)
      return(
        <>
          <div>{name}</div>
        </>
      )
    }
  };
};
