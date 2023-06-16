import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { Button } from 'antd';

const HomePage: React.FC = () => {
  // if (localStorage.getItem('name')===null || localStorage.getItem('name') == '') {
  //   window.location.href = '/login';
  // }
  
  const name = localStorage.getItem("name")
  return (
    <PageContainer
      // content="欢迎使用 ProLayout 组件"
      // tabList={[
      //   {
      //     tab: '基本信息',
      //     key: 'base',
      //   },
      //   {
      //     tab: '详细信息',
      //     key: 'info',
      //   },
      // ]}
      extra={[
        <div>
          {name}
        </div>,
        <Button key="1" type="primary"
          onClick={()=>{
            localStorage.setItem('name', '')
            window.location.href = '/login';
          }}
        >
          登录/注册
        </Button>,
      ]}
    >

      <div className={styles.container}>
        <Guide name={'区淘'} />
      </div>
    </PageContainer>
  );
};

export default HomePage;
