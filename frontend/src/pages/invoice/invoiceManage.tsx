import { Table,Form, Row,Col, Upload,Button ,Space ,Spin, message,Badge} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { getUploadLog,deleteDataFormLog } from '@/services/backend/api';

import {UploadOutlined ,ArrowRightOutlined,FileExcelOutlined} from '@ant-design/icons';
import axios from 'axios';
// import { uploadFile } from '@/services/swagger/pet';

export const InvoiceManage: React.FC<any> = () => {
  const uploadPath = "http://localhost:3000/api/billing/invoice/readExcelFile";
    
  const [loadingPage, setLoadingPage] = useState(false);
  const [resData, setResData] = useState([]);

  

  const columns = [
    // {
    //   title: 'Log No.',
    //   dataIndex: 'log_number',
    //   key: 'log_number',
    // },
    {
      title: 'วันที่อัพโหลด',
      dataIndex: 'upload_date',
      key: 'upload_date',
    },
    {
      title: 'ชื่อไฟล์อัพโหลด',
      dataIndex: 'file_name',
      key: 'file_name',
    },
    {
      title: 'สถานะของข้อมูล',
      dataIndex: 'show_type',
      key: 'show_type',
    },
    {
        title: 'Action',
        dataIndex: 'log_number',
        key: 'log_number',
        render: (text: string, key: any[]) => (checkDelete(key)),
      },
  ];

  const checkDelete = (key: any)=>{
    if(key.log_type_id === '1'){
      return     <a href="#" key="{key}"  onClick={() => DeleteData(key)}> checkDelete(key) </a>
    }else{
      return ""
    }
  }



  const DeleteData = async ( key: string | any[]) => {
        console.log(key)
    // const excelId = await getDataexport(dataid);
    if (key) {
      var json = {
        data:key
      };
      // const data = JSON.stringify(json);
     await deleteDataFormLog(json);
     getTable()
    }

  };
  
  useEffect( () => {
    getTable()
  }, []);

  async function getTable() {
    const dataList = await getUploadLog('2');
    if(!dataList){

    }else{
      (async function fetchdata() {
        const result = dataList
        console.log(result)
        const data = result.map(
          
          (x: {
            id:any;
            upload_date: any;
            file_name: any;
            log_type_name: any;
            log_number: any;
            file_type_id:any;
          }) => {
            let show_type ="";
            if(x.file_type_id == '1'){
              show_type = "Active";
            }else if(x.file_type_id == '2'){
              show_type = "Deleted";
            }
            const mapData = {
              id:x.id,
              upload_date: x.upload_date,
              file_name: x.file_name,
              log_type_name: x.log_type_name,
              log_number: x.log_number,
              file_type_id:x.file_type_id,
              show_type:show_type,
            };
            return mapData;
          },
        );
        setResData(data);
      })();
    }
  }

  const DownloadTemp = () =>{
    window.open(`http://localhost:3000/download-files/template_invoice.xlsx`);
  }
  const uploadFile = (values :any) =>{
    console.log('file values');
    console.log(values);
    const data = new FormData();
    data.append("excelfile",values.excelfile.file.originFileObj,values.excelfile.file.originFileObj.name);
    console.log(values.excelfile.file.originFileObj.name);
    // for (let file of values.excelfile.file.originFileObject) {
    //   data.append('photo[]', file);
    // }

    axios.post(uploadPath,data,{
      headers: {
        "Comtent-Type":"multipart/form-data",
      }
    }).then(res =>{
      message.success("Import Success");
    }).catch(error =>{
      message.error("Import Error");
    })
  }
  
 
  
  return (
    <Spin tip="loading..." spinning={loadingPage} >
    <Row>
      <Col span="4"> 
            <h3>Download Template</h3>
            <Button onClick={DownloadTemp} icon={<FileExcelOutlined />} type="primary" >Download Template</Button>
        </Col>
        <Col span="3">
          <Form name="file-upload-form" onFinish={uploadFile} >
              <h3>Import File</h3>
              <Upload  accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button> 
              </Upload >
              <br/>
              <Button  type="primary" icon={<ArrowRightOutlined />} htmlType="submit">Submit</Button>
          </Form>
        </Col>
    </Row>
    <br/>
    <Row>
      <Col span={24}>
        <Table rowKey="log_number" dataSource={resData} columns={columns} />
      </Col>
      
    </Row>
    
    </Spin>
      
  );
};
