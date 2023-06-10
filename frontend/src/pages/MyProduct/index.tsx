import Guide from '@/components/Guide/index';
import services from '@/services/demo';
import { createProduct, listMyProduct, listProduct, modifyProduct } from '@/services/demo/UserController';

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


const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;


const handleAdd = async (fields: API.createProductInfo) => {
  const hide = message.loading('正在添加');
  try {
    console.log(fields)
    let res = await createProduct({ ...fields, username: localStorage.getItem('name') || ''});
    if (res.success == false)
      throw new Error(res.message);
    hide();
    message.success('添加成功');
    return true;
  } catch (error) {
    hide();
    message.error('添加失败请重试！');
    return false;
  }
};

const handleModify = async (fields: API.modifyProductInfo) => {
  const hide = message.loading('正在更新');
  try {
    console.log(fields)
    let res = await modifyProduct({ ...fields, username: localStorage.getItem('name') || ''});
    if (res.success == false)
      throw new Error(res.message);
    hide();
    message.success('更新成功');
    return true;
  } catch (error) {
    hide();
    message.error('更新失败请重试！');
    return false;
  }
};



const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [createBranchModalVisible, handleBranchModalVisible] = useState<boolean>(false);
  const [borrowListDrawerVisible, setBorrowListDrawerVisible] = useState<boolean>(false);
  const [updateStockFormVisible, setUpdateStockFormVisible] = useState<boolean>(false);
  const [updateInfoFormVisible, setUpdateInfoFormVisible] = useState<boolean>(false);
  const [borrowFormVisible, setBorrowFormVisible] = useState<boolean>(false);
  const [modifyFormVisible, setModifyFormVisible] = useState<boolean>(false);
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
      hideInForm: true,
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
      hideInForm: true,
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
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              console.log(record)
              setRow(record)
              setModifyFormVisible(true);
              //setStepFormValues(record);
            }}
          >
            更新
          </a>
        </>
      ),
    },
  ];

  

  const columnsBooks: ProDescriptionsItemProps<API.BookInfo>[] = columns.slice(1, columns.length);

  if (localStorage.getItem('name') == '') {
    window.location.href = '/login';
  }
  return (localStorage.getItem('name') == "") ? <Guide /> : (
    <PageContainer
      header={{
      }}
    >
      <ProTable<API.productInfo>
        headerTitle="我的商品列表"
        actionRef={actionRef}
        rowKey="cardId"
        search={false}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
        ]}
        request={async (
          params,
          sorter,
          filter,
        ) => {
          // const { payload, success } = await listProduct({
          //   ...params,
          //   sorter,
          //   filter,
          // });
          const { payload, success } = await listMyProduct({
            username:localStorage.getItem('name') || '',
          });
          console.log(params)
          console.log(payload);
          return {
            data: payload || [],
            success,
          };
        }}
        columns={columns}
      // rowSelection={{
      //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
      // }}
      />
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        title="新建"
      >
        <ProTable<API.productInfo, API.productInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>

      <CreateForm
        onCancel={() => setModifyFormVisible(false)}
        modalVisible={modifyFormVisible}
        title="更新更新更新"
      >
        <ProTable<API.productInfo, API.productInfo>
          onSubmit={async (value) => {
            const success = await handleModify({...value, productId:row?.id});
            if (success) {
              setModifyFormVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
          form={{
            initialValues: row,
          }}
        />
      </CreateForm>

    </PageContainer>
  );
};

export default TableList;
