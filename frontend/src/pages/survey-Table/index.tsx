import { Table, Modal, Form, Input, Row, Col, DatePicker, Image, Button, Select, message, notification ,Tag, Upload} from 'antd';
import { ExclamationCircleOutlined ,InboxOutlined} from '@ant-design/icons';
import React, { useState, useEffect, useRef } from 'react';
import moment from 'moment';
import { getDataexport, getPositionsAll, downloadExcel, getFileallsurvay, getFillAllUser, getdataDetail, getdataDetaillist, getImagedetail, updateDatasurvey ,updateDetailsurvey, updateProductById, productDatatale} from '@/services/backend/api';
import { await } from '@umijs/deps/compiled/signale';
import { Content } from 'antd/lib/layout/layout';
import { icons } from 'antd/lib/image/PreviewGroup';
import SignatureCanvas from 'react-signature-canvas';
import { text } from 'express';



export const SurveyTable: React.FC<any> = () => {

  const { TextArea } = Input;

  const { Option } = Select;

  const { Dragger } = Upload;

  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      onFilter: (value: any, record: { company_name: string | any[] }) =>
        record.company_name.indexOf(value) === 0,
    },
    {
      title: 'user code',
      dataIndex: 'name',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'survey code',
      dataIndex: 'survey_code',
      render: (text: string) => (<a href="#" onClick={async () => detailServay(text)}>{text}</a>),
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'company name',
      dataIndex: 'company_name',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'status',
      key: 'status',
      dataIndex: 'status',
      render: (status: any) => ( checkStatus(status)),
    },
    {
      title: 'Title',
      dataIndex: 'title',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'date',
      dataIndex: 'doc_date',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'Export',
      dataIndex: 'id',
      render: (text: string, data_survey: string | any[]) => (<a href="#" onClick={() => Exportexcel(text, data_survey)}> Export </a>),
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
  ];

  const checkStatus =(status: string)=>{
    if(status ==="Register"){
      return <Tag color="blue">{status}</Tag>
    }else if (status === "Reject"){
      return <Tag color='red'>{status}</Tag>
    }else{
      return <Tag color='green'>{status}</Tag>
    }
  }

  const columnsDetail = [
    {
      title: 'ลำดับ',
      dataIndex: 'id',
      onFilter: (value: any, record: { company_name: string | any[] }) =>
        record.company_name.indexOf(value) === 0,
    },
    {
      title: 'รหัสสินค้า',
      dataIndex: 'product_code',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'รายการ',
      dataIndex: 'product_name',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'จำนวน',
      dataIndex: 'quantity',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'คงเหลือในสต็อก',
      dataIndex: 'product_num',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'ประเภท',
      dataIndex: 'unit',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
    },
    {
      title: 'สถรานะ',
      key: 'stock_status',
      dataIndex: 'stock_status',
      onFilter: (value: any, record: { status: string | any[] }) =>
        record.status.indexOf(value) === 0,
        
      render: (stock_status: any) => ( Checkstock(stock_status)),
    },
  ];
  const Checkstock = (stock_status: any) =>{
    if(stock_status === 1){
      return <Tag color="green">มี</Tag>
    }else{
      return <Tag color="red">ไม่มี</Tag>
    }
  }
  

  const dateToDay = () => {
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();

    let todayNew = `${yyyy}-${mm}-${dd}`;
    return todayNew;
  }

  // Data set state
  const [modelvisible, setModelVisible] = useState(false);
  const [resData, setResData] = useState<IDataRes[]>([]);
  // const [resDataDetaillist, setResDataDetaillist] = useState<IDataResDetaillist[]>([]);
  const [resProduct, setResProduct] = useState<Dataproduct[]>([]);
  const [dataImage, setResDataImage] = useState('');
  const [detailusercode, setDetailusercode] = useState('');
  const [detailsurveycode, setDetailsurveycode] = useState('');
  const [detailcompanyname, setDetailcompanyname] = useState('');
  const [detailtitle, setDetailtitle] = useState('');
  const [detaildocdate, setDetaildocdate] = useState<string>('');
  const [detaildetails, setDetaildetails] = useState<string>('');
  const [detailillustration, setDetailillustration] = useState<string>('');
  const [detailissuedate, setDetaililissuedate] = useState<string>('');
  const [detaililnumberusers, setDetaililnumberusers] = useState<string>('');
  const [detaililremark, setDetaililremark] = useState<string>('');
  const [detaililnote, setDetaililnote] = useState<string>('');
  const [detaililstatus, setDetailstatus] = useState<string>('');
  const [detaililformcode, setDetailformcode] = useState<string>('');
  const [detaililoperatorsigned, setDetailoperatorsigned] = useState<string>('');
  const [detailoperatorname, setDetailoperatorname] = useState<string>('');
  const [detailoperatorposition, setDetailoperatorposition] = useState<string>('');
  const [detailoperatordate, setDetailoperatordate] = useState<string>('');
  // select position
  const [position, setPosition] = useState<string>("เลือกตำแหน่ง");
  const [posiotionsArray, setPositions] = useState<DataTypePositions[]>([]);
  const [dateSignature, setDateSignature] = useState<string>(dateToDay());
  const [inspactorsigned, setInspactorsigned] = useState<string>('');
  const [inspactorname, setInspactorname] = useState<string>('');
  const [inspactorposition, setInspactorposition] = useState<string>('');
  const [inspactordate, setInspactordate] = useState<string>('');
  // state insert
  const [namesignager, setNamesignager] = useState<string>('');
  const [isSignature, setIsSignature] = useState<string>('');
  // model status
  const [statestatusRegis, setStatestatusRegis] = useState(true);
  const [statestatusAppove, setStatusAppove] = useState(true);
  const [statestatusReject, setStatestatusReject] = useState(true);
  // Rejact
  const [commentreject, setCommentrejact] = useState('');
  const [modelrejact, setModelrejact] = useState(false);
  const [commentmodel, setCommentmodel] = useState('');
  const [buttonstatusre, setButtonstatusre] = useState(true);
  const [buttonstatusok, setButtonstatusok] = useState(true);
  const [buttonstatused, setButtonstatused] = useState(true);

  const [disablereject, setDisablereject] = useState(true);
  // disable image
  const [imagedisable, setImagedisable] = useState(true);
  const [imagedisableimport, setImagedisableimport] = useState(true);

  const Exportexcel = async (iD: string, data_survey: string | any[]) => {
    const dataid = {
      id: iD,
      survey_code: data_survey.survey_code,
    }
    const excelId = await getDataexport(dataid);
    if (excelId) {
      window.open(`http://localhost:5000/api/download/excel/${excelId}`);
    }
  };
  const handleNameModel = (value: string) => {
    setNamesignager(value);
  }

  const handlePosition = (value: string) => {
    setPosition(value);
  }

  const handleDateSignature = (value: any) => {
    let startDate = moment(value).format('YYYY-MM-DD');
    setDateSignature(startDate);
  }
  useEffect(() => {
    (async function fetchdata() {
      const dataResPositons = await getPositionsAll();
      setPositions(dataResPositons);
    })();
  }, []);


  let sigPad = {};

  // modeldetail
  const detailServay = async (iD: string) => {
    const dataDetailmodel = await getdataDetail(iD);
    const dataDetailmodellist = await getdataDetaillist(iD);
    const dataImagedetail = await getImagedetail(iD)
    const dataProducttable = await productDatatale(iD);
    // setResDataDetaillist(dataDetailmodellist);
    setResDataImage(dataImagedetail);
    setResProduct(dataProducttable)
    //set Detail
    setDetailusercode(dataDetailmodel[0].user_code);
    setDetailsurveycode(dataDetailmodel[0].survey_code);
    setDetailcompanyname(dataDetailmodel[0].company_name);
    setDetailtitle(dataDetailmodel[0].title);
    setDetaildocdate(dataDetailmodel[0].doc_date);
    setDetaildetails(dataDetailmodel[0].details);
    setDetailillustration(dataDetailmodel[0].illustration);
    setDetaililissuedate(dataDetailmodel[0].issue_date);
    setDetaililnumberusers(dataDetailmodel[0].number_users);
    setDetaililremark(dataDetailmodel[0].remark);
    setDetaililnote(dataDetailmodel[0].note);
    setDetailstatus(dataDetailmodel[0].status);
    setDetailformcode(dataDetailmodel[0].form_code);
    setDetailoperatorsigned(dataDetailmodel[0].operator_signed);
    setDetailoperatorname(dataDetailmodel[0].operator_name);
    setDetailoperatorposition(dataDetailmodel[0].operator_position);
    setDetailoperatordate(dataDetailmodel[0].operator_date);
    //set Detail signatuer
    setInspactorsigned(dataDetailmodel[0].inspactor_signed);
    setInspactorname(dataDetailmodel[0].inspactor_name);
    setInspactorposition(dataDetailmodel[0].inspactor_position);
    setInspactordate(dataDetailmodel[0].inspactor_date);
    //set Detail comment
    setCommentmodel(dataDetailmodel[0].comment_reject);
    if(dataDetailmodel[0].status === 'Register'){
      setStatestatusRegis(false);
      setStatusAppove(true);
      setStatestatusReject(true);
      // button status
      setButtonstatusre(false);
      setButtonstatusok(false);
      setButtonstatused(true);
      setImagedisable(false);
      setImagedisableimport(true);
      // value status
      setDisablereject(true);
    }else if(dataDetailmodel[0].status === 'Reject'){
      setStatestatusRegis(true);
      setStatusAppove(true);
      setStatestatusReject(false);
      setImagedisable(true);
      setImagedisableimport(false);
      // button status
      setButtonstatusre(true);
      setButtonstatusok(true);
      setButtonstatused(false);
      // value status
      setDisablereject(false);
    } else if(dataDetailmodel[0].status === 'Appove'){
      setStatestatusRegis(true);
      setStatusAppove(false);
      setStatestatusReject(true);
      setImagedisable(false);
      setImagedisableimport(true);
      // button status
      setButtonstatusre(true);
      setButtonstatusok(false);
      setButtonstatused(true);
      // value status
      setDisablereject(true);
    }
    console.log(resProduct);
    await setModelVisible(true);
  }

  const refeshTable = async () => {
    const result = await getFillAllUser();
    const data = result.map(
      (x: {
        id: any;
        name: any;
        survey_code: any;
        company_name: any;
        title: any;
        status: any;
        doc_date: any;
      }) => {
        const mapData = {
          id: x.id,
          name: x.name,
          survey_code: x.survey_code,
          company_name: x.company_name,
          title: x.title,
          status: x.status,
          doc_date: x.doc_date
        };
        return mapData;
      },
    );
    setResData(data);
  };


  const imagesmodel = () => {
    const numberimage = dataImage.length;
    if (numberimage > 0) {
      const tempData = [];
      for (let i = 0; i < numberimage; i++) {
        const dataimagelabel = (<Image width={200} src={(dataImage[i].images)} />);
        tempData.push(dataimagelabel);
      }
      return tempData;
    }
  }

  function onChange(pagination: any, filters: any, sorter: any, extra: any) {
    // console.log('params', pagination, filters, sorter, extra);
  }

  const oksetVisible = async () => {
    if (detaililstatus === 'Register') {
      if (isSignature === '') {
        message.error("กรุณาเซ็นชื่อ");
        // eslint-disable-next-line no-useless-return
        return;
      }
      if (namesignager === '') {
        message.error("กรุณาลงชื่อ");
        document.getElementById('namesignager')?.focus();
        return;
      }
      if (position === 'เลือกตำแหน่ง') {
        message.error("กรุณาเลือกตำแหน่ง");
        return;
      }
      setSubmitdata();
    } else {
      setModelVisible(false);
    }
  }

  const endSignager = () => {
    let pngUrl = sigPad.getTrimmedCanvas().toDataURL('image/png');
    setIsSignature(pngUrl);
  }

  const openNotificationWithIcon = (type: any) => {
    notification[type]({
      message: 'Success',
      description:
        'Success.',
    });
  };

  // from reject
  const handleComNameChang = (value: string) => {
    setDetailcompanyname(value);
  }
  const handleProNameChang = (value: string) => {
    setDetailtitle(value);
  }
  const setWorkDetail = (value: string) => {
    setDetaildetails(value);
  }
  const setEtcDetail = (value: string) => {
    setDetaililremark(value);
  }
  const handleNumOfpeopleChang = (value: number) => {
    setDetaililnumberusers(value);
  }
  const setNote = (value: string) => {
    setDetaililnote(value)
  }

  // Button OK edit
  const editsetVisible = async () => {
    const dataEdit = {
      detailsurvey_code: detailsurveycode,
      company_name: detailcompanyname,
      title: detailtitle,
      doc_date: detaildocdate,
      details: detaildetails,
      illustration: detailillustration,
      issue_date: detailissuedate,
      number_users: detaililnumberusers,
      remark: detaililremark,
      note: detaililnote,
      status: "Register"
    }
    await updateDatasurvey(dataEdit);
    await refeshTable();
    await openNotificationWithIcon('success');
    await setModelVisible(false);
  }


  const cancelsetVisible = async () => {
    setStatusAppove(true);
    setStatestatusRegis(true);
    setModelVisible(false);
  }
  const rejactVisible = async () => {
    setModelrejact(true);
  }

  // button Reject
  const rejactok = async() => {
    const data = {
      detailsurvey_code: detailsurveycode,
      comment_reject: commentreject,
      status: "Reject",
    }
    if(commentreject === ''){
      message.error("กรุณากรอกเหตุผล");
      return;
    }
    updateDatasurvey(data);
    refeshTable();
    openNotificationWithIcon('success');
    await setModelrejact(false);
    await setModelVisible(false);
  }

  const rejactcancel = () => {
    setCommentrejact('');
    setModelrejact(false);
  }

  const rejactChang = (value: string) =>{
    setCommentrejact(value);
  }

  const clearSigPad = () => {
    sigPad.clear();
    const index = setIsSignature('');
    const newFileList = index;
    return {
      isSignature: newFileList,
    };
  }

// button Ok appove
  const setSubmitdata = async () => {
    const data = {
      detailsurvey_code: detailsurveycode,
      inspactor_signed: isSignature,
      inspactor_name: namesignager,
      inspactor_position: position,
      inspactor_date: dateSignature,
      status: "Appove",
    }
    for(let r = 0; r < resProduct.length; r++){
      const balance_update = parseInt(resProduct[r].product_num) - parseInt(resProduct[r].quantity)
      const update_servey = {
        id: resProduct[r].id,
        survey_code: resProduct[r].survey_code,
        product_code: resProduct[r].product_code,
        product_name: resProduct[r].product_name,
        product_num: resProduct[r].product_num,
        balance: balance_update,
        stock_status: '1',
        remark: 'test',
      }
      const update_product = {
        product_name: resProduct[r].product_name,
        product_code: resProduct[r].product_code,
        product_num: balance_update,
      }
      updateDetailsurvey(update_servey);
      updateProductById(update_product);
    // console.log(update_product)
    }
    await updateDatasurvey(data);
    await refeshTable();
    if (data) {
      setStatestatusRegis(true);
      setStatusAppove(true);
    }
    await openNotificationWithIcon('success');
    await setModelVisible(false);
  }
  
  interface Dataproduct{
    id: any,
    survey_code: any,
    product_code: any,
    product_name: any,
    quantity: any,
    product_num: any,
    unit: any,
    remark: any,
  }

  // interface IDataResDetaillist {
  //   id: any;
  //   survey_code: any;
  //   product_code: any;
  //   product_name: any;
  //   quantity: any;
  //   unit: any;
  //   balance: any;
  //   stock_status: any;
  // }
  interface IDataRes {
    id: any;
    name: any;
    survey_code: any;
    company_name: any;
    title: any;
    status: any;
    doc_date: any;
  }
  interface DataTypePositions {
    key: React.Key;
    position_code: string;
    position_name_en: string;
    position_name_th: string;
  }
  

  useEffect(() => {
    (async function fetchdata() {
      const result = await getFillAllUser();
      const data = result.map(
        (x: {
          id: any;
          name: any;
          survey_code: any;
          company_name: any;
          title: any;
          status: any;
          doc_date: any;
        }) => {
          const mapData = {
            id: x.id,
            name: x.name,
            survey_code: x.survey_code,
            company_name: x.company_name,
            title: x.title,
            status: x.status,
            doc_date: x.doc_date
          };
          return mapData;
        },
      );
      setResData(data);
    })();
  }, []);

  return (
    <>
      <Table columns={columns} dataSource={resData} onChange={onChange} />
      <Modal
        title="Detail"
        centered
        visible={modelvisible}
        footer={[
          <Button key="1" onClick={() => cancelsetVisible()}>Cancel</Button>,
          <Button key="2" onClick={() => rejactVisible()} type="danger" hidden={buttonstatusre} >Rejact</Button>,
          <Button key="3" onClick={() => oksetVisible()} type="primary" hidden={buttonstatusok} >OK</Button>,
          <Button key="3" onClick={() => editsetVisible()} type="primary" hidden={buttonstatused} >OK</Button>
        ]}
        // onOk={() => oksetVisible()}
        onCancel={() => cancelsetVisible()}
        width={1000}
      >
        <Form layout="vertical">
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={8}>
              <Form.Item label="Company Name">
                <Input placeholder="Company Name" value={detailcompanyname} disabled={disablereject} onChange={(e)=>{handleComNameChang(e.target.value)}} />
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item label="Project Name">
                <Input placeholder="Project Name" value={detailtitle} disabled={disablereject} onChange={(e)=>{handleProNameChang(e.target.value)}}/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={8}>
              <Form.Item label="Date">
                <DatePicker style={{ width: '100%' }} defaultValue={moment(detaildocdate, 'YYYY/MM/DD')} disabled={disablereject}/>
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <Col className="gutter-row" span={24}>
              <Form.Item label="รายละเอียดของงาน">
                <TextArea
                  rows={6}
                  value={detaildetails}
                  onChange={(e)=>{setWorkDetail(e.target.value)}}
                  disabled={disablereject}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row hidden={imagedisable}>
            <Col className="gutter-row" span={24}>
              <Form.Item label="รูปภาพรายละเอียดของงาน">
                {imagesmodel()}
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }} hidden={imagedisableimport}>
            <Col className="gutter-row" span={24}>
              <Form.Item label="รายละเอียดของงาน">
                <Dragger>
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined  />
                  </p>
                  <p className="ant-upload-text">Click or drag .jpg or .png to this area to upload</p>
                </Dragger>
              </Form.Item>
            </Col>
          </Row>
          <Row >
            <Col className="gutter-row" span={24}>
              <Form.Item>
                <TextArea
                  rows={6}
                  onChange={(e)=>{setEtcDetail(e.target.value)}}
                  value={detaililremark}
                  disabled={disablereject}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={12}>
              <Form.Item label="วันที่ดำเนินการ" >
                <DatePicker style={{ width: '100%' }} defaultValue={moment(detailissuedate, 'YYYY/MM/DD')} disabled={disablereject}/>
              </Form.Item>
            </Col>
            <Col className="gutter-row" span={12}>
              <Form.Item label="จำนวนคนที่ใช้ (คน)">
                <Input placeholder="Number of People"  onChange={(e)=>{handleNumOfpeopleChang(e.target.value)}} value={detaililnumberusers} disabled={disablereject}/>
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={24}>
              <Form.Item label="หมายเหตุ">
                <TextArea
                  onChange={(e)=>{setNote(e.target.value)}}
                  value={detaililnote}
                  disabled={disablereject}
                  rows={6}
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
            <Col className="gutter-row" span={24}>
              <Form.Item label="รายการอุปกรณ์">
                <Table columns={columnsDetail} dataSource={resProduct} onChange={onChange}/>
              </Form.Item>
            </Col>
          </Row>
          <div>
            <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
              <Col className="gutter-row" span={12}>
                <Form.Item label="ผู้ร้องขอ" style={{ textAlign: 'center' }}>
                  <Image width={300} height={100}
                    src={detaililoperatorsigned} />
                  <Input value={detailoperatorname} bordered={false} style={{ textAlign: 'center' }} />
                  <Input value={detailoperatorposition} bordered={false} style={{ textAlign: 'center' }} />
                  <Input value={detailoperatordate} bordered={false} style={{ textAlign: 'center' }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12} hidden={statestatusRegis}>
                <Form.Item label="ผู้รับรอง">
                  <SignatureCanvas
                    penColor='black'
                    onEnd={() => { endSignager(); }}
                    canvasProps={{ width: 470, height: 200, className: 'sigCanvas' }}
                    ref={(ref: any) => { sigPad = ref }}
                    backgroundColor={'#f0f2f5'} />
                  <br>
                  </br>
                  <Button type="primary" onClick={clearSigPad}>
                    Clear
                  </Button>
                  <Input placeholder="ลงชื่อ" id="namesignager" onChange={(e) => { handleNameModel(e.target.value) }} value={namesignager} allowClear />
                  <Select
                    showSearch
                    style={{ width: '100%' }}
                    placeholder="เลือกตำแหน่ง"
                    optionFilterProp="children"
                    defaultValue={position}
                    onChange={handlePosition}
                    id="selectPosition"
                  >
                    {posiotionsArray.map((option) => (
                      <Option value={option.position_name_en} > {option.position_name_en}{' '}
                      </Option>
                    ))}
                  </Select>
                  <DatePicker style={{ width: '100%' }} onChange={handleDateSignature} defaultValue={moment(dateSignature, 'YYYY/MM/DD')} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12} hidden={statestatusAppove} >
                <Form.Item label="ผู้รับรอง" style={{ textAlign: 'center' }}>
                  <Image width={300} height={100}
                    src={inspactorsigned}
                  />
                  <Input value={inspactorname} bordered={false} style={{ textAlign: 'center' }} />
                  <Input value={inspactorposition} bordered={false} style={{ textAlign: 'center' }} />
                  <Input value={inspactordate} bordered={false} style={{ textAlign: 'center' }} />
                </Form.Item>
              </Col>
              <Col className="gutter-row" span={12} hidden={statestatusReject}>
                <Form.Item label="เหตุผลสำหรับการตีกลับ" style={{ textAlign: 'center' }}>
                  <TextArea value={commentmodel} style={{ textAlign: 'center',color: 'red' }} />
                </Form.Item>
              </Col>
            </Row>
          </div>
        </Form>
      </Modal>
      <Modal
        title="เหตุผมสำหรับการตีกลับ"
        visible={modelrejact}
        onOk={rejactok}
        onCancel={rejactcancel}
        okText="Ok"
        cancelText="Cancel"
        >
        <Input onChange={(e)=>{rejactChang(e.target.value)}} value={commentreject} allowClear id="Rejactcomment"
          bordered={false}
          placeholder="อธิบายเพิ่มเติม">
        </Input>
      </Modal>
    </>
  );
};
