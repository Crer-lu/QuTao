import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';
import { Button } from 'antd';
import bkgimg from "../../assets\\c.png"

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
      style={{
        backgroundImage: `url(${bkgimg})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
        height: '100vh',
      }}
    >

      <div className={styles.container}>
        <Guide name={'区淘'} />
      </div>
      
      {/* <div style={{
          position:"absolute", 
          width:"100%",
          height:"100%", 
          zIndex:0,
        }}
      >
        <img src={bkgimg} style={{
            width:"100%",
            height:"100%", 
          }}>
        </img>
      </div> */}
    </PageContainer>
  );
};

export default HomePage;
