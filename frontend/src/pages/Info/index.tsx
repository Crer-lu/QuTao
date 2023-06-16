import Guide from '@/components/Guide';
import { changePassword, recharge } from '@/services/demo/UserController';
import { message, Button} from 'antd';
import { useEffect, useState } from 'react';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
  ProList,
  ProForm,
  EditableProTable,
} from '@ant-design/pro-components';


const fetchBalance = async (fields: API.rechargeInfo) => {
  const hide = message.loading('查询余额');
  try {
    console.log(fields)
    let res = await recharge({ amount: 0, username: localStorage.getItem('name') || '' });
    if (res.success == false)
      throw new Error(res.message);
    hide();
    message.success('查询余额成功');
    return res.payload;
  } catch (error) {
    hide();
    message.error('查询余额失败请重试！');
    return false;
  }
};

const handleChangePassword = async (fields: API.changePasswordInfo) => {
  const hide = message.loading('修改密码');
  try {
    console.log(fields)
    let res = await changePassword(fields);
    if (res.success == false)
      throw new Error(res.message);
    hide();
    message.success('修改密码成功');
    return true;
  } catch (error) {
    hide();
    message.error('修改密码失败请重试！');
    return false;
  }
};

const handleRecharge = async (fields: API.rechargeInfo) => {
  const hide = message.loading('充值');
  try {
    console.log(fields)
    let res = await recharge(fields);
    if (res.success == false)
      throw new Error(res.message);
    hide();
    message.success('充值成功');
    return res;
  } catch (error) {
    hide();
    message.error('充值失败请重试！');
    return false;
  }
};


const name = localStorage.getItem("name")
const HomePage: React.FC = () => {

  const [balance, setBalance] = useState(0);

  const fetchData = async () => {
    const result = await fetchBalance({});
    setBalance(result);
  };
  useEffect(() => {
    if (localStorage.getItem('name') != "")
      fetchData();
  }, [])

  const columns = [
    {
      title: '原密码',
      dataIndex: 'oldPassword',
      valueType: 'password',
    },
    {
      title: '新密码',
      dataIndex: 'newPassword',
      valueType: 'password',
    },
  ];

  const columnsRecharge = [
    {
      title: '数量',
      dataIndex: 'amount',
      valueType: 'digit',
    }
  ];


  if (localStorage.getItem('name') === null || localStorage.getItem('name') == '') {
    window.location.href = '/login';
  }
  return (localStorage.getItem('name') == "") ? <Guide /> : (
    <PageContainer
      extra={[
        <div>
          {name}
        </div>,
        <Button key="1" type="primary"
          onClick={() => {
            localStorage.setItem('name', '')
            window.location.href = '/logout';
          }}
        >
          登出
        </Button>,
      ]}
    >
      <div
        style={{
          margin: '24px',
        }}
      >
        用户名：{localStorage.getItem('name')}
      </div>
      <div
        style={{
          margin: '24px',
        }}
      >
        用户余额：{balance}
        <button
          onClick={async () => {
            const result = await fetchBalance({});
            setBalance(result);
          }}
          style={{
            marginLeft: 8,
            radius: 8,
            height: 32,
            padding: '0 15px',
            fontSize: 14,
            border: '1px solid #d9d9d9',
            borderRadius: 2,
            background: '#fff',
            color: 'rgba(0, 0, 0, 0.65)',
            boxShadow: '0 2px 0 rgba(0, 0, 0, 0.015)',
            transition: 'all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1)',
            cursor: 'pointer',
          }}
        >
          刷新
        </button>
      </div>
      <div
        style={{
          margin: '24px',
        }}
      >
        <div
          style={{
            marginBottom: 24,
          }}
        >
          修改密码：
        </div>
        <ProTable<API.productInfo, API.productInfo>
          onSubmit={async (value) => {
            const success = await handleChangePassword({ ...value, username: localStorage.getItem('name') || '' });
          }}
          rowKey="id"
          type="form"
          columns={columns}
          form={{
            style: {
              margin: 20,
            },
          }}
          style={{
            width: '50%',
          }}
        />
      </div>
      <div
        style={{
          margin: '24px',
        }}
      >
        <div
          style={{
            marginBottom: 24,
          }}
        >
          兑换：
        </div>
        <ProTable<API.productInfo, API.productInfo>
          onSubmit={async (value) => {
            const res = await handleRecharge({ ...value, username: localStorage.getItem('name') || '' });
            if (res.success) {
              setBalance(res.payload);
            }
          }}
          rowKey="id"
          type="form"
          columns={columnsRecharge}
          form={{
            style: {
              margin: 20,
            },
            initialValues: {
              amount: 0,
            },
          }}
          style={{
            width: '50%',
          }}
        />
      </div>
    </PageContainer>
  );
};

export default HomePage;
