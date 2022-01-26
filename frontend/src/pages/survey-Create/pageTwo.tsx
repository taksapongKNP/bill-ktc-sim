import React, { useState, useEffect } from 'react';
import { Table, Radio, Divider, Select, Button, Row, Col, InputNumber, Form, Input } from 'antd';
import { getProductAll } from '@/services/backend/api';

const { Option } = Select;

const columns = [
  {
    title: 'ลำดับ',
    dataIndex: 'key',
  },
  {
    title: 'รหัสสินค้า',
    dataIndex: 'product_code',
  },
  {
    title: 'รายการ',
    dataIndex: 'product_name',
  },
  {
    title: 'จำนวน',
    dataIndex: 'quantity',
  },
  {
    title: 'หน่วย',
    dataIndex: 'unit',
  },
  {
    title: 'คงเหลือ',
    dataIndex: 'balance',
  },
  {
    title: 'สถานะคลังอุปกรณ์',
    dataIndex: 'stock_status',
  },
  {
    title: 'หมายเหตุ',
    dataIndex: 'remark',
  },
];

interface IDataRes {
  id: React.Key;
  product_code: string;
  product_name: string;
  quantity: number | string;
  unit: string;
  balance: number | string;
  stock_status: string;
  remark: string;
}

// rowSelection object indicates the need for row selection
const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: IDataRes[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: IDataRes) => ({
    disabled: record.product_name === 'Disabled User', // Column configuration not to be checked
    name: record.product_name,
  }),
};

function onChange(value: any) {
  console.log(`selected ${value}`);
}

function onBlur() {
  console.log('blur');
}

function onFocus() {
  console.log('focus');
}

function onSearch(val: any) {
  console.log('search:', val);
}

export const PageTwo: React.FC<any> = () => {
  const [form] = Form.useForm();
  const [resData, setResData] = useState<IDataRes[]>([]);

  useEffect(() => {
    (async function fetchdata() {
      const dataRes = await getProductAll();
      setResData(dataRes);
    })();
  }, []);

  // const data: IDataRes[] = [
  //   {
  //     key: '1',
  //     product_code: 'osd-001',
  //     product_name: 'product 1',
  //     quantity: 2,
  //     unit: 'ตัว',
  //     balance: 20,
  //     stock_status: 'มี',
  //     remark: '-',
  //   },
  // ];

  return (
    <div>
      <Form form={form} layout="vertical">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={2}>
            <Form.Item>
              <Button type="primary">Add</Button>
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item label="รหัสสินค้า / รายการ" required tooltip="This is a required field">
              <Select
                showSearch
                style={{ width: '100%' }}
                placeholder="Select a person"
                optionFilterProp="children"
                onChange={onChange}
                onFocus={onFocus}
                onBlur={onBlur}
                onSearch={onSearch}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                {resData.map((option) => (
                  <Option value={option.product_code}>
                    {option.product_code} /{option.product_name}{' '}
                  </Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col className="gutter-row" span={4}>
            <Form.Item label="จำนวน" required tooltip="This is a required field">
              <InputNumber min={1} max={1000} defaultValue={0} style={{ width: '100%' }} />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={4}>
            <Form.Item label="หน่วย" required tooltip="This is a required field">
              <Input style={{ width: '100%' }} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col span={24}>
          <Table
            rowSelection={{
              type: 'checkbox',
              ...rowSelection,
            }}
            columns={columns}
            dataSource={resData}
            title={() => 'รายการอุปกรณ์'}
          />
        </Col>
      </Row>
    </div>
  );
};
