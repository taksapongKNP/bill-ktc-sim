import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card, Tabs } from 'antd';
import { useIntl,  } from 'umi';


const { TabPane } = Tabs;

export default (): React.ReactNode => {

  const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        
      </Card>
    </PageContainer>
  );
};