import services from '@/services/demo';
import { addBook, addBooks, addCard, borrowBook, deleteBook, deleteCard, modifyBookInfo, modifyBookStock, queryBook, showBorrowHistory, showCards } from '@/services/demo/UserController';
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
import CreateForm from './components/CreateForm';


const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.BookInfo) => {
  const hide = message.loading('正在添加');
  try {
    console.log(fields)
    let res = await addBook({ ...fields });
    if (res.ok == false)
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

const handleAddBooks = async (fields: any) => {
  const hide = message.loading('正在添加');
  try {
    //console.log(fields)
    let res = await addBooks(fields);
    if (res.ok == false)
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

const handleModifyStock = async (fields: number[]) => {
  const hide = message.loading('正在更改');
  try {
    //console.log(fields)
    let res = await modifyBookStock([...fields]);
    if (res.ok == false)
      throw new Error(res.message);
    hide();
    message.success('更改成功');
    return true;
  } catch (error) {
    hide();
    message.error('更改失败请重试！');
    return false;
  }
};

const handleModifyInfo = async (fields: any) => {
  const hide = message.loading('正在更改');
  try {
    console.log(fields)
    let res = await modifyBookInfo({ ...fields });
    if (res.ok == false)
      throw new Error(res.message);
    hide();
    message.success('更改成功');
    return true;
  } catch (error) {
    hide();
    message.error('更改失败请重试！');
    return false;
  }
};

const handleBorrow = async (fields: any) => {
  const hide = message.loading('正在借书');
  try {
    console.log(fields)
    let res = await borrowBook({ ...fields });
    if (res.ok == false)
      throw new Error(res.message);
    hide();
    message.success('借书成功');
    return true;
  } catch (error) {
    hide();
    message.error('借书失败请重试！');
    return false;
  }
};

/**
 * 更新节点
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('正在配置');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('配置成功');
    return true;
  } catch (error) {
    hide();
    message.error('配置失败请重试！');
    return false;
  }
};

/**
 *  删除节点
 * @param selectedRows
 */
const handleRemove = async (record: API.BookInfo) => {
  const hide = message.loading('正在删除');
  try {
    let res = await deleteBook(record.bookId);
    if (res.ok == false)
      throw new Error(res.message);
    hide();
    message.success('删除成功，即将刷新');
    return true;
  } catch (error) {
    hide();
    message.error('删除失败，请重试');
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

  const columns: ProDescriptionsItemProps<API.BookInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'bookId',
      // tip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      hideInForm: true,
    },
    {
      title: '类别',
      dataIndex: 'category',
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
      title: '书名',
      dataIndex: 'title',
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
      title: '出版社',
      dataIndex: 'press',
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
      title: '年份',
      dataIndex: 'publishYear',
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
      title: '年份',
      dataIndex: 'publishYear',
      valueType: 'digitRange',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
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
      title: '价格',
      dataIndex: 'price',
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
      title: '价格',
      dataIndex: 'price',
      valueType: 'digitRange',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '剩余库存',
      dataIndex: 'stock',
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
              handleRemove(record)
              actionRef.current.reload();
              //handleUpdateModalVisible(true);
              //setStepFormValues(record);
            }}
          >
            删除
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              console.log(record)
              setRow(record);
              setUpdateStockFormVisible(true);
              //setStepFormValues(record);
            }}
          >
            更改库存
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              console.log(record)
              setRow(record)
              setUpdateInfoFormVisible(true);
              //setStepFormValues(record);
            }}
          >
            编辑信息
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              console.log(record)
              setRow(record)
              setBorrowFormVisible(true);
              //setStepFormValues(record);
            }}
          >
            借书
          </a>
        </>
      ),
    },
  ];

  const columnsModify: ProDescriptionsItemProps<API.BookInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'bookId',
      // tip: '名称是唯一的 key',
      formItemProps: {
        rules: [
          {
            required: true,
            message: '名称为必填项',
          },
        ],
      },
      hideInForm: true,
    },
    {
      title: '类别',
      dataIndex: 'category',
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
      title: '书名',
      dataIndex: 'title',
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
      title: '出版社',
      dataIndex: 'press',
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
      title: '年份',
      dataIndex: 'publishYear',
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
      title: '年份',
      dataIndex: 'publishYear',
      valueType: 'digitRange',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInTable: true,
      hideInForm: true,
    },
    {
      title: '作者',
      dataIndex: 'author',
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
      title: '价格',
      dataIndex: 'price',
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
      title: '价格',
      dataIndex: 'price',
      valueType: 'digitRange',
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
      hideInTable: true,
      hideInForm: true,
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
              handleRemove(record)
              actionRef.current.reload();
              //handleUpdateModalVisible(true);
              //setStepFormValues(record);
            }}
          >
            删除
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              console.log(record)
              setRow(record);
              setUpdateStockFormVisible(true);
              //setStepFormValues(record);
            }}
          >
            更改库存
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              console.log(record)
              setRow(record)
              setUpdateInfoFormVisible(true);
              //setStepFormValues(record);
            }}
          >
            编辑信息
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              console.log(record)
              setRow(record)
              setBorrowFormVisible(true);
              //setStepFormValues(record);
            }}
          >
            借书
          </a>
        </>
      ),
    },
  ];

  const columnsBooks: ProDescriptionsItemProps<API.BookInfo>[] = columns.slice(1, columns.length);
  return (
    <PageContainer
      header={{
        title: '图书管理',
      }}
    >
      <ProTable<API.BookInfo>
        headerTitle="图书列表"
        actionRef={actionRef}
        rowKey="cardId"
        search={{ labelWidth: 'auto' }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            新建
          </Button>,
          <Button
            key="2"
            type="primary"
            onClick={() => {
              handleBranchModalVisible(true)
              setDataSource([])
            }}
          >
            批量新建
          </Button>,
        ]}
        request={async (
          params,
          sorter,
          filter,
        ) => {
          const { payload, ok } = await queryBook({
            ...params,
            sorter,
            filter,
          });
          console.log(params)
          // console.log(payload);
          return {
            data: payload?.results || [],
            ok,
          };
        }}
        columns={columns}
      // rowSelection={{
      //   onChange: (_, selectedRows) => setSelectedRows(selectedRows),
      // }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              已选择{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              项&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            批量删除
          </Button>
          <Button type="primary">批量审批</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
        title="新建书籍"
      >
        <ProTable<API.BookInfo, API.BookInfo>
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
        onCancel={() => handleBranchModalVisible(false)}
        modalVisible={createBranchModalVisible}
        title="新建书籍"
      >
        <EditableProTable<API.BookInfo>
          headerTitle="批量新建列表"
          rowKey="id"
          scroll={{
            x: 960,
          }}
          columns={columnsBooks}
          value={dataSource}
          onChange={setDataSource}
          recordCreatorProps={{
            newRecordType: 'dataSource',
            record: () => ({
              id: (Math.random() * 1000000).toFixed(0),
            }),
          }}
          toolBarRender={() => {
            return [
              <Button
                type="primary"
                key="save"
                onClick={async () => {
                  // dataSource 就是当前数据，可以调用 api 将其保存
                  //console.log(dataSource);
                  const success = await formBooks.validateFields(); 
                  console.log(success)
                  if (success) {
                    handleAddBooks(dataSource);
                  }
                  handleBranchModalVisible(false);
                  if (actionRef.current) {
                    actionRef.current.reload();
                  }
                }}
              >
                提交
              </Button>,
            ];
          }}
          editable={{
            type: 'multiple',
            editableKeys,
            actionRender: (row, config, defaultDoms) => {
              return [defaultDoms.delete];
            },
            onValuesChange: (record, recordList) => {
              setDataSource(recordList);
            },
            onChange: setEditableRowKeys,
            form: formBooks,
          }}
        />
        
      </CreateForm>
      <CreateForm
        onCancel={() => setUpdateStockFormVisible(false)}
        modalVisible={updateStockFormVisible}
        title="更改库存"
      >
        <ProTable<API.BookInfo, API.BookInfo>
          onSubmit={async (value) => {
            let args = [row?.bookId, value.deltaStock];
            //console.log(args)
            const success = await handleModifyStock(args);
            if (success) {
              setUpdateStockFormVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={[
            {
              title: '库存增量',
              dataIndex: 'deltaStock',
              valueType: 'text',
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
      <CreateForm
        onCancel={() => setUpdateInfoFormVisible(false)}
        modalVisible={updateInfoFormVisible}
        title="编辑信息"
      >
        <ProTable<API.BookInfo, API.BookInfo>
          onSubmit={async (value) => {
            let args = { ...value, bookId: row?.bookId, stock: row?.stock };
            console.log(args)
            const success = await handleModifyInfo(args);
            if (success) {
              setUpdateInfoFormVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columnsModify}
          form={{
            initialValues: row,
          }}
        />
      </CreateForm>
      <CreateForm
        onCancel={() => setBorrowFormVisible(false)}
        modalVisible={borrowFormVisible}
        title="借书"
      >
        <ProTable<API.BookInfo, API.BookInfo>
          onSubmit={async (value) => {
            let args = { bookId: row?.bookId, cardId: value.cardId };
            //console.log(args)
            const success = await handleBorrow(args);
            if (success) {
              setBorrowFormVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={[
            {
              title: '借书证编号',
              dataIndex: 'cardId',
              valueType: 'text',
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
