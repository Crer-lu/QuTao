import { login, register } from '@/services/demo/UserController';
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
    const res = await register({...values});
    if (res && res.success) {
      message.success(
        "注册成功"
      );
      console.log("res:",res)
      localStorage.setItem("name",values.username)

      // if (!history) return;
      // const {query} = history.location;
      // const {redirect} = query as { redirect: string };
      window.location.href = '/login'
      return;
    }

    // 如果失败去设置用户错误信息
    localStorage.setItem("name","")

    message.error(res.message);
  } catch (error) {
    console.log(error)
    message.error("注册失败");
  }
};

export default () => {
  const [loginType, setLoginType] = useState<LoginType>('account');
  
  const {name, setName} = useModel('user');

  return (
    <ProConfigProvider hashed={false}>
      <div style={{ backgroundColor: 'white' }}>
        <LoginForm
          logo={<img src={logoimg} />}
          title="QuTao"
          subTitle="垃圾区块链平台"
          actions={
            <></>
          }
          onFinish={async (values) => {
            await handleSubmit(values as API.loginInfo,setName);
          }}
          submitter={{
            searchConfig: {
              submitText: '注册',
            },
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
              window.location.href = '/login'
            }}
          >
            去登录
          </a>
        </div>
      </div>
    </ProConfigProvider>
  );
};