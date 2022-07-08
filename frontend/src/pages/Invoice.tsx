import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import { Card,  Tabs } from 'antd';
// import { useIntl, FormattedMessage } from 'umi';

import { InvoiceTable } from './invoice/invoiceTable';
import { InvoiceManage } from './invoice/invoiceManage';

const { TabPane } = Tabs;

export default (): React.ReactNode => {

  // const intl = useIntl();
  return (
    <PageContainer>
      <Card>
        <Tabs defaultActiveKey="1">
          <TabPane tab="Detail" key="1">
          <InvoiceTable />
          </TabPane>
          <TabPane tab="Import" key="2">
          <InvoiceManage />
          </TabPane>
        </Tabs>
      </Card>
    </PageContainer>
  );
};
