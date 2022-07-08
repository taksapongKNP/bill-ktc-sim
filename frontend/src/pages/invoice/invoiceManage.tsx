import { Table,Form, Row,Col, Upload,Button ,Space ,Spin, message,Badge} from 'antd';
import React, { useState, useEffect, useRef } from 'react';
import { getUploadLog,deleteDataFormLog ,sendSmsFormLog} from '@/services/backend/api';
import Swal from 'sweetalert2'
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
      dataIndex: 'log_type_name',
      key: 'log_type_name',
    },
    {
      title: 'การส่ง SMS',
      dataIndex: 'sms_status',
      key: 'sms_status'
    },
    {
        title: 'Action',
        dataIndex: 'log_number',
        key: 'log_number',
        render: (text: string, key: any[]) => (checkDelete(key)),
      },
  ];

  const checkDelete = (key: any)=>{
    if(key.log_type_id == '1'){
      let statusDisabled = true;
      
        if(key.file_created_status == 1){
         statusDisabled = false
        }
      return     <>
      
                    <Button href="#"  type="primary" style={{marginRight : 10}} onClick={() => SendSms(key)} disabled={statusDisabled} > Send SMS </Button>
                    <Button href="#"  type="primary"  onClick={() => DeleteData(key)} danger> Delete </Button>

                </>
    }else{
      return ""
    }
  }


  const SendSms = async ( key: string | any[]) => {
    if (key) {
      let isExecuted = confirm("ยืนยันการส่ง SMS");
      if(isExecuted === true){
        var json = {
          data:key
        };
        await sendSmsFormLog(json).then(res =>{
          message.success("Send SMS Success");
          getTable()
        }).catch(error =>{
          message.error("Send SMS Error");
        });
        
      }
      // Swal.fire({
      //   title: 'Custom width, padding, color, background.',
      //   width: 600,
      //   padding: '3em',
      //   color: '#716add',
      //   background: '#fff',
      //   backdrop: `
      //     rgba(0,0,123,0.4)
      //     url("http://13.213.88.165:8081/icons/nyan-cat-nyan.gif")
      //     left top
      //     no-repeat
      //   `
      // })
    }
  };
  const DeleteData = async ( key: string | any[]) => {
        // console.log(key)
    // const excelId = await getDataexport(dataid);
    if (key) {
      let isExecuted = confirm("ยืนยันการส่ง SMS");
      if(isExecuted === true){
        var json = {
          data:key
        };
        await deleteDataFormLog(json).then(res =>{
          message.success("Delete Success");
          getTable()
        }).catch(error =>{
          message.error("Delete Error");
        });
        
      }
     
    }

  };
  
  useEffect( () => {
    getTable()
  }, []);

  async function getTable() {
    const dataList = await getUploadLog('2');
    if(!dataList){

    }else{
      // console.log(dataList);
      (async function fetchdata() {
        const result = dataList
        console.log(result)
        const data = result.map(
          
          (x: {
            id:any;
            upload_date: any;
            file_name: any;
            log_type_id:any;
            log_type_name: any;
            log_number: any;
            file_type_id:any;
            file_created_status: any;
            
          }) => {
            let sms_status = "";
            if(x.file_created_status == 0 || x.log_type_id == 2){
              sms_status ="ไม่สามารถส่งได้";
            }
            else if(x.file_created_status == 1 ){
              sms_status ="รอส่ง";
            }else if(x.file_created_status == 2){
              sms_status ="ส่งแล้ว";
            }
            const mapData = {
              id:x.id,
              upload_date: x.upload_date,
              file_name: x.file_name,
              log_type_name: x.log_type_name,
              log_number: x.log_number,
              file_type_id:x.file_type_id,
              log_type_id:x.log_type_id,
              file_created_status: x.file_created_status,
              sms_status:sms_status
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
    // console.log(values.excelfile.file.originFileObj.name);
    // for (let file of values.excelfile.file.originFileObject) {
    //   data.append('photo[]', file);
    // }
    setLoadingPage(true);
    axios.post(uploadPath,data,{
      headers: {
        "Comtent-Type":"multipart/form-data",
      }
    }).then(res =>{
      setLoadingPage(false);
      message.success("Import Success");
      getTable()
    }).catch(error =>{
      setLoadingPage(false);
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
              <Form.Item name="excelfile">
              <Upload   accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel" maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button> 
              </Upload >
              </Form.Item>
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
