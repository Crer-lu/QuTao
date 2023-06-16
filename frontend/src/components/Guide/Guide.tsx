import { Layout, Row, Typography } from 'antd';
import React from 'react';
import styles from './Guide.less';

interface Props {
  name: string;
}

// 脚手架示例组件
const Guide: React.FC<Props> = (props) => {
  const { name } = props;
  return (
    <Layout>
      <Row>
        <Typography.Title level={3} className={styles.title}>
          <div style={{
            textAlign: 'center',
            fontSize: '50px',
            marginTop: '150px',
            marginBottom: '0px',
          }}>
            欢迎使用
          </div>
          <div style={{
            textAlign: 'center',
            fontSize: '170px',
            marginTop: '0px',
            marginBottom: '50px',
            // color: 'rgb(36, 33, 33)',
            color: '#392F41',
          }}>{name}</div>

        </Typography.Title>
      </Row>
    </Layout>
  );
};

export default Guide;
