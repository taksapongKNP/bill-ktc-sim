import { Table, Row,Col,  Input, DatePicker,Button ,Space ,Spin} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { getdataInvoiceByDate,exportZipInvoiceByDate} from '@/services/backend/api';

import { SearchOutlined, FilePdfOutlined, DownloadOutlined ,FileZipOutlined } from '@ant-design/icons';
import { replace } from 'lodash';

const { RangePicker } = DatePicker;
export const InvoiceTable: React.FC<any> = () => {
  
    const columns = [
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
            render: (text: string, data_survey: string | any[]) => (<a href="#" onClick={() => ExportPDf(text, data_survey)}> Export </a>),
          },
      ];

      const ExportPDf = async (iD: string, key: string | any[]) => {
        
        // const excelId = await getDataexport(dataid);
        if (iD) {
          var json = {
            startDate: startDate.replaceAll('/','|'),
            endDate:endDate.replaceAll('/','|'),
            id:iD
          };
          const data = JSON.stringify(json);
          window.open(`http://localhost:3000/api/billing/invoice/pdf/${data}`);
        }

      };

        const [resData, setResData] = useState('');
        useEffect(() => {
       
        }, []);
    
  const [loadingPage, setLoadingPage] = useState(false);
  const [disbledButton, setDisbledButton] = useState(true);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const onChange2 =async (e: string,dateString: any) => {
    setStartDate(dateString[0]);
    setEndDate(dateString[1]);
    const data = {
      startDate: dateString[0],
      endDate: dateString[1]
    };
    const dataList = await getdataInvoiceByDate(data);
    
    (async function fetchdata() {
            const result = dataList;
            if(result.length > 0) {
              setDisbledButton(false);
            }else{
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
                  cust_mobile: x.cust_mobile
                };
                return mapData;
              },
            );
            setResData(data);
          })();
          
  }


  async function exportPdfList() {
    var json = {
      startDate: startDate.replaceAll('/','|'),
      endDate:endDate.replaceAll('/','|')
    };
    const data = JSON.stringify(json);
    // const buffer = await exportPdfByDate(data);
    // window.open(`http://localhost:3000/api/billing/invoice/pdfByDate`);
    window.open(`http://localhost:3000/api/billing/invoice/pdfByDate/${data}`);
    
  }
  
  async function exportZipList() {
    var w = window;
    setLoadingPage(true);
    var dateJson = {
      startDate: startDate.replaceAll('/','|'),
      endDate:endDate.replaceAll('/','|')
    };
    var data = JSON.stringify(dateJson);
    await exportZipInvoiceByDate(data).then(function (value){
      
      var pathJson = {
        path: value
      };
      var pathdata = JSON.stringify(pathJson);
      setLoadingPage(false);
      // console.log(`url : http://localhost:3000/api/billing/invoice/downloadFileByPath/${pathdata}`);
      w.location.href = `http://localhost:3000/api/billing/invoice/downloadFileByPath/${pathdata}`;
    })
    
    

    
    
   
  }

  
  
  return (
    <Spin tip="loading..." spinning={loadingPage} >
    <Row>
      <Space>
        <RangePicker
          id="date" name= "date"
          format="DD/MM/YYYY"
          onChange={onChange2 }
          />
        <Button type="primary" icon={<FilePdfOutlined />} onClick={exportPdfList} disabled={disbledButton}  >Download PDF</Button>
        <Button type="primary" icon={<FileZipOutlined />} onClick={exportZipList} disabled={disbledButton}  >Download Zip</Button>
      </Space>
    </Row>
    <br/>
    <Row>
      <Col span={24}>
        <Table dataSource={resData} columns={columns} />
      </Col>
      
    </Row>
    
    </Spin>
      
  );
};
