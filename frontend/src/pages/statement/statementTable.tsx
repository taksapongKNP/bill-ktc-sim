import { Table, Row, Col, DatePicker, Button, Space, Spin, Select, Form } from 'antd';
import React, { useState, useEffect } from 'react';
import { getdataBillingByDate, exportZipByDate, getTemplate, exportPdfByDate } from '@/services/backend/api';
import axios from 'axios';


import { FilePdfOutlined, FileZipOutlined } from '@ant-design/icons';

const { RangePicker } = DatePicker;
export const StatementTable: React.FC<any> = () => {
  const columns: any = [
    {
      title: 'วันที่อัพเดท',
      dataIndex: 'bill_cycle_start',
      key: 'bill_cycle_start',
    },
    {
      title: 'ชื่อลูกค้า',
      dataIndex: 'cust_name',
      //   key: 'cust_name',
    },
    {
      title: 'ที่อยู่',
      dataIndex: 'cust_add',
      //   key: 'cust_add',
    },
    {
      title: 'Customer Id',
      dataIndex: 'cust_id',
      //   key: 'cust_id',
    },
    {
      title: 'Account No',
      dataIndex: 'account_no',
      //   key: 'account_no',
    },
    {
      title: 'Invoice No',
      dataIndex: 'invoice_no',
      //   key: 'invoice_no',
    },
    {
      title: 'Tax Id',
      dataIndex: 'tax_id',
      //   key: 'tax_id',
    },
    {
      title: 'Mobile',
      dataIndex: 'cust_mobile',
      //   key: 'cust_mobile',
    },
    {
      title: 'Export',
      dataIndex: 'invoice_no',
      // key: 'id',
      render: (text: string, data: string | any[]) => (
        <a href="#" onClick={() => ExportPDf(text, data)}>
          {' '}
          Export{' '}
        </a>
      ),
    },
  ];

  const ExportPDf = async (iD: string, key: string | any[]) => {
    // const excelId = await getDataexport(dataid);
    if (iD) {
      var json = {
        startDate: startDate.replaceAll('/', '|'),
        endDate: endDate.replaceAll('/', '|'),
        id: iD,
        template: template,
      };
      // const dataPDF = {
      //   data : JSON.stringify(json),
      //   template
      // }
      const data = JSON.stringify(json);
      // window.open(`http://13.213.88.165:3000/api/billing/statement/pdf/${data}`);
      window.open(`http://localhost:3000/api/billing/statement/pdf/${data}`);
    }
  };

  const [resData, setResData] = useState([]);
  useEffect(() => {}, []);
  
  const [loadingPage, setLoadingPage] = useState(false);
  const [disbledButton, setDisbledButton] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [template, setTemplate] = useState('');
  const [select, setSelected]  = useState('');
  const [datatemplate,setDataTemplate] = useState<any[]>([]);
  const { Option } = Select;

  const handleChange = async (value: string) => {
    console.log(`${value}`);
    setTemplate(value);
    startDate;
    console.log(startDate + '--------------------');
     if (value && startDate) {
       setDisbledButton(false);
     } else {
       setDisbledButton(true);
     }
  };
    //Drop down Template
    const fetchData = () => {
        axios
          .get('http://localhost:3000/api/template/gettemplate')
          .then((response) => {
            const { data } = response;
            if(response.status === 200){
                //check the api call is success by stats code 200,201 ...etc
                setDataTemplate(data)
            }else{
                //error handle section 
            }
          })
          .catch((error) => console.log(error));
      };

    useEffect(()=>{
        fetchData();
    },[])
 
 
  const onChange2 = async (e: any, dateString: any) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
    // console.log(template);
    // setTemplate(value);
    // template;
    // setValue(template);
    // console.log(dateString[1]);
    const data = {
      startDate: dateString[0],
      endDate: dateString[1],
      template:  template,
      // value,
    };

    const dataList = await getdataBillingByDate(data);
    console.log(dataList);
    (async function fetchdata() {
      const result: any = dataList;
      if (result.length > 0 && template) {
        setDisbledButton(false);
      } else {
        setDisbledButton(true);
      }
      const data = result.map(
        (x: {
          id: any;
          bill_cycle_start: any;
          cust_name: any;
          cust_add: any;
          cust_id: any;
          account_no: any;
          invoice_no: any;
          tax_id: any;
          cust_mobile: any;
          template: any;
        }) => {
          const mapData = {
            key: x.id,
            bill_cycle_start: x.bill_cycle_start,
            cust_name: x.cust_name,
            cust_add: x.cust_add,
            cust_id: x.cust_id,
            account_no: x.account_no,
            invoice_no: x.invoice_no,
            tax_id: x.tax_id,
            cust_mobile: x.cust_mobile,
            template: x.template,
          };
          return mapData;
        },
      );    
      setResData(data);
    })();
  };
  
  async function exportPdfList() {
    console.log("--------------Strat--------------");
    
    var json = {
      startDate: startDate.replaceAll('/', '|'),
      endDate: endDate.replaceAll('/', '|'),
      template,
    };
    // const dataPDF = {
    //   data : JSON.stringify(json),
    //   template
    // }

    // console.log(dataPDF);

    const data = JSON.stringify(json);
    // template;
    // const buffer = await exportPdfByDate(data);
    // window.open(`http://localhost:3000/api/billing/statement/pdfByDate`);
    // window.open(`http://13.213.88.165:3000/api/billing/statement/pdfByDate/${data}`);
    window.open(`http://localhost:3000/api/billing/statement/pdfByDate/${data}`);
  }

  // async function exportPdfList() {
  //   var w = window;
  //    setLoadingPage(true);
  //   var json = {
  //     startDate: startDate.replaceAll('/', '|'),
  //     endDate: endDate.replaceAll('/', '|'),
  //     template,
  //   };

  //   // console.log(dataPDF);
  //   var data = JSON.stringify(json);
  //   await exportPdfByDate(data).then(function (value) {
  //     var pathJson = {
  //       path: value,
  //     };
  //     var pathdata = JSON.stringify(pathJson);
  //     setLoadingPage(false);
  //     // w.location.href = `http://13.213.88.165:3000/api/billing/statement/downloadFileByPath/${pathdata}`;
  //     w.location.href = `http://localhost:3000/api/billing/statement/downloadFileByPath/${pathdata}`;
  //   });
  // }

  async function exportZipList() {
    var w = window;
    setLoadingPage(true);
    var dateJson = {
      startDate: startDate.toString().split('/').join('|'),
      endDate: endDate.toString().split('/').join('|'),
      template,
    };
    var data = JSON.stringify(dateJson);
    await exportZipByDate(data).then(function (value) {
      var pathJson = {
        path: value,
      };
      var pathdata = JSON.stringify(pathJson);
      setLoadingPage(false);
      // w.location.href = `http://13.213.88.165:3000/api/billing/statement/downloadFileByPath/${pathdata}`;
      w.location.href = `http://localhost:3000/api/billing/statement/downloadFileByPath/${pathdata}`;
    });
  }
  // const onFinish = (values: any) => {
  //   console.log(values);
  // };
  // const [form] = Form.useForm();

  return (
    <Spin tip="loading..." spinning={loadingPage}>
      <Form
      // form={form} name="control-hooks" onFinish={onFinish}
      >
        <Row>
          <Space>
            {/* <Form.Item rules={[{ required: true }]}> */}
            <Select
              defaultValue="Template"
              style={{ width: 150 }}
              onChange={handleChange}
            >
              {datatemplate.map(item => (
              <Option  key={item.template}>{item.template}</Option>
                 ))} 
            </Select>
            {/* </Form.Item> */}
            <RangePicker id="date" name="date" format="DD/MM/YYYY" onChange={onChange2} />
            <Button
              type="primary"
              icon={<FilePdfOutlined />}
              onClick={exportPdfList}
              disabled={disbledButton}
              htmlType="submit"
            >
              Download PDF
            </Button>

            <Button
              type="primary"
              icon={<FileZipOutlined />}
              onClick={exportZipList}
              disabled={disbledButton}
              htmlType="submit"
            >
              Download Zip
            </Button>
          </Space>
        </Row>
      </Form>

      <br />
      <Row>
        <Col span={24}>
          <Table scroll={{ x: 2000 }} dataSource={resData} columns={columns} />
        </Col>
      </Row>
    </Spin>
  );
};
