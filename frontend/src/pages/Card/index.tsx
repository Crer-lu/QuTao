import services from '@/services/demo';
import { addCard, deleteCard, returnBook, showBorrowHistory, showCards } from '@/services/demo/UserController';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProDescriptions,
  ProDescriptionsItemProps,
  ProTable,
  ProList,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';


const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;

/**
 * 添加节点
 * @param fields
 */
const handleAdd = async (fields: API.CardInfo) => {
  const hide = message.loading('正在添加');
  try {
    console.log(fields)
    let res=await addCard({ ...fields });
    if(res.ok==false)
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

const handleReturn = async (fields: any) => {
  const hide = message.loading('正在还书');
  try {
    console.log(fields)
    let res=await returnBook({ ...fields });
    if(res.ok==false)
      throw new Error(res.message);
    hide();
    message.success('还书成功');
    return true;
  } catch (error) {
    hide();
    message.error('还书失败请重试！');
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
const handleRemove = async (record: API.CardInfo) => {
  const hide = message.loading('正在删除');
  try {
    let res = await deleteCard(record.cardId);
    if(res.ok==false)
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
  const [borrowListDrawerVisible, setBorrowListDrawerVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const actionRefRecord = useRef<ActionType>();
  const [row, setRow] = useState<API.CardInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.CardInfo[]>([]);
  
  const columns: ProDescriptionsItemProps<API.CardInfo>[] = [
    {
      title: 'ID',
      dataIndex: 'cardId',
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
      title: '姓名',
      dataIndex: 'name',
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
      title: '院系',
      dataIndex: 'department',
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
      title: '属性',
      dataIndex: 'type',
      // hideInForm: true,
      valueEnum: {
        'Student': { text: '学生', status: 'STUDENT' },
        'Teacher': { text: '老师', status: 'TEACHER' },
      },
      formItemProps: {
        rules: [
          {
            required: true,
          },
        ],
      },
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
              //handleUpdateModalVisible(true);
              //setStepFormValues(record);
              setBorrowListDrawerVisible(true);
            }}
          >
            查询借书记录
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: '借书证管理',
      }}
    >
      <ProTable<API.CardInfo>
        headerTitle="借书证列表"
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
          const { payload, ok } = await showCards({
            ...params,
            sorter,
            filter,
          });
          console.log(params)
          // console.log(payload);
          return {
            data: payload?.cards || [],
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
      >
        <ProTable<API.CardInfo, API.CardInfo>
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
      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        <div  style={{color: "blue", fontSize: "30px"}}>
          {row?.name}的借书记录
        </div>
        {row?.cardId && (
          <ProTable<any>
            actionRef={actionRefRecord}
            search={false}
            request={async (
              params
            ) => {
              console.log(params)
              const { payload, ok } = await showBorrowHistory(params?.id);
              // console.log(payload);
              return {
                data: payload?.items || [],
                ok,
              };
            }}
            params={{
              id: row?.cardId,
            }}
            columns={[
              {
                title: '书号',
                dataIndex: 'bookId',
                valueType: 'text',
              },
              {
                title: '书名',
                dataIndex: 'title',
                valueType: 'text',
              },
              {
                title: '借书时间',
                dataIndex: 'borrowTime',
                valueType: 'dateTime',
              },
              {
                title: '还书时间',
                dataIndex: 'returnTime',
                valueType: 'dateTime',
              },
              {
                title: '操作',
                dataIndex: 'option',
                valueType: 'option',
                render: (_, record) => (
                  <>
                    {record.returnTime==0&&
                    (<a
                      onClick={() => {
                        console.log(record)
                        handleReturn(record)
                        actionRefRecord.current.reload();
                        //handleUpdateModalVisible(true);
                        //setStepFormValues(record);
                      }}
                    >
                      还书
                    </a>)}
                  </>
                ),
              },
            ]}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
