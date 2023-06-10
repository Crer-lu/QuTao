import Guide from '@/components/Guide';
import { PageContainer } from '@ant-design/pro-components';
import styles from './index.less';

const HomePage: React.FC = () => {
  if (localStorage.getItem('name') == '') {
    window.location.href = '/login';
  }
  return (
    <PageContainer>
      <div className={styles.container}>
        <Guide name={'区淘'} />
        <div className={styles.DDDcontainer}>
          <div>
            By PM250
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default HomePage;
