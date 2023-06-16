import services from '@/services/demo';

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
import { Button, Divider, Drawer, message } from 'antd';
import { Form } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from '../components/CreateForm';


const { buyProduct, listProduct } =
  services.UserController;


const handleBuy = async (fields: any) => {
  const hide = message.loading('正在购买');
  try {
    console.log(fields)
    let res = await buyProduct({ ...fields });
    if (res.success == false)
      throw new Error(res.message);
    hide();
    message.success('购买成功');
    return true;
  } catch (error) {
    hide();
    console.log(error.message)
    message.error(error.message);
    return false;
  }
};




const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createBranchModalVisible, handleBranchModalVisible] = useState<boolean>(false);
  const [updateStockFormVisible, setUpdateStockFormVisible] = useState<boolean>(false);
  const [updateInfoFormVisible, setUpdateInfoFormVisible] = useState<boolean>(false);
  const [buyFormVisible, setBuyFormVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.BookInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.BookInfo[]>([]);
  const [form] = Form.useForm();
  const [formBooks] = Form.useForm();
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [dataSource, setDataSource] = useState<readonly API.BookInfo[]>(() => []);

  const columns: ProDescriptionsItemProps<API.productInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'id',
      // tip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      hideInSearch: true,
    },
    {
      title: 'URL',
      dataIndex: 'url',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInSearch: true,
    },
    {
      title: '金额',
      dataIndex: 'price',
      valueType: 'money',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInSearch: true,
    },
    {
      title: '拥有者',
      dataIndex: 'owner',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInSearch: true,
    },
    {
      title: '名称',
      dataIndex: 'name',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInSearch: true,
    },
    {
      title: '描述',
      dataIndex: 'description',
      valueType: 'text',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
    },
    {
      title: '余量',
      dataIndex: 'allowance',
      valueType: 'digit',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInSearch: true,
    },
    {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              console.log(record)
              setRow(record)
              setBuyFormVisible(true);
              //setStepFormValues(record);
            }}
          >
            购买
          </a>
        </>
      ),
    },
  ];

  

  const name = localStorage.getItem("name")
  const columnsBooks: ProDescriptionsItemProps<API.BookInfo>[] = columns.slice(1, columns.length);

  return (
    <PageContainer
      header={{
      }}
      extra={[
        <div>
          {name==''?'未登录':name}
        </div>,
        <Button key="1" type="primary"
          onClick={()=>{
            localStorage.setItem('name', '')
            window.location.href = '/logout';
          }}
        >
          {name==''?'登录/注册':'登出'}
        </Button>,
      ]}
    >
      <ProTable<API.productInfo>
        headerTitle="商品列表"
        actionRef={actionRef}
        rowKey="cardId"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
        ]}
        request={async (
          params,
          sorter,
          filter,
        ) => {
          const { payload, success } = await listProduct({
            message:params?.description,
          });
          console.log(params)
          console.log(payload);
          return {
            data: payload || [],
            success,
          };
        }}
        columns={columns}
      />
      
      
      
      
      <CreateForm
        onCancel={() => setBuyFormVisible(false)}
        modalVisible={buyFormVisible}
        title="借书"
      >
        <ProTable<API.BookInfo, API.BookInfo>
          onSubmit={async (value) => {
            let args = {username:localStorage.getItem("name"),productId: row?.id, times: value.times };
            //console.log(args)
            const success = await handleBuy(args);
            if (success) {
              setBuyFormVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={[
            {
              title: '购买数量',
              dataIndex: 'times',
              valueType: 'digit',
              formItemProps: {
                rules: [
                  {
                    required: true,
                  }
                ],
              },
            },
          ]}
        />
      </CreateForm>
    </PageContainer>
  );
};

export default TableList;
