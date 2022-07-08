import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card,  Tabs } from 'antd';
// import { useIntl, FormattedMessage } from 'umi';

import { StatementTable } from './statement/statementTable';
import { StatementManage } from './statement/statementManage';
// import { SurveyCreate } from './survey-Create';
// import { SurveyForm } from './survey-Form';

const { TabPane } = Tabs;

export default (): React.ReactNode => {

  // const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Detail" key="1">
          <StatementTable />
          </TabPane>
          <TabPane tab="Import" key="2">
          <StatementManage />
          </TabPane>
          {/* <TabPane tab="Servay Form" key="3">
            <SurveyForm />
          </TabPane> */}
        </Tabs>
      </Card>
    </PageContainer>
  );
};
