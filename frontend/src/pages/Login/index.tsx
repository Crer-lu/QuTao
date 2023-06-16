import { login } from '@/services/demo/UserController';
import {
  AlipayCircleOutlined,
  LockOutlined,
  MobileOutlined,
  TaobaoCircleOutlined,
  UserOutlined,
  WeiboCircleOutlined,
} from '@ant-design/icons';
import {
  LoginForm,
  ProConfigProvider,
  ProFormCaptcha,
  ProFormCheckbox,
  ProFormText,
} from '@ant-design/pro-components';
import { message, Space, Tabs } from 'antd';
import type { CSSProperties } from 'react';
import { useState } from 'react';
import logoimg from "../../assets\\b.png"
import { history, useModel } from 'umi';

type LoginType = 'account';

const iconStyles: CSSProperties = {
  marginInlineStart: '16px',
  color: 'rgba(0, 0, 0, 0.2)',
  fontSize: '24px',
  verticalAlign: 'middle',
  cursor: 'pointer',
};

const handleSubmit = async (values: API.loginInfo,setName: (name: string) => void) => {

  console.log('values', values)

  try {
    const res = await login({...values});
    if (res && res.success) {
      message.success(
        "登录成功"
      );
      console.log("res:",res)
      localStorage.setItem("name",values.username)

      // if (!history) return;
      // const {query} = history.location;
      // const {redirect} = query as { redirect: string };
      window.location.href = '/'
      return;
    }

    // 如果失败去设置用户错误信息
    localStorage.setItem("name","")

    message.error("登录失败");
  } catch (error) {
    console.log(error)
    message.error("登录失败");
  }
};

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  
  const {name, setName} = useModel('user');

  return (
    <ProConfigProvider hashed={false}>
      <div style={{}}>
        <LoginForm
          logo={<img src={logoimg} />}
          title="QuTao"
          subTitle="去中心化交易平台"
          actions={
            <></>
          }
          onFinish={async (values) => {
            await handleSubmit(values as API.loginInfo,setName);
          }}
        >
          <ProFormText
            name="username"
            fieldProps={{
              size: 'large',
            }}
            placeholder={'用户名'}
            rules={[
              {
                required: true,
                message: '请输入用户名!',
              },
            ]}
          />
          <ProFormText.Password
            name="password"
            fieldProps={{
              size: 'large',
            }}
            placeholder={'密码'}
            rules={[
              {
                required: true,
                message: '请输入密码！',
              },
            ]}
          />
        </LoginForm>
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <a
            style={{
              display: 'block',
              textAlign: 'center',
            }}
            onClick={() => {
              window.location.href = '/register'
            }}
          >
            去注册
          </a>
        </div>
        <div
          style={{
            marginBlockEnd: 24,
          }}
        >
          <a
            style={{
              display: 'block',
              textAlign: 'center',
            }}
            onClick={() => {
              window.location.href = '/product'
            }}
          >
            游客模式查看商品
          </a>
        </div>
      </div>
    </ProConfigProvider>
  );
};