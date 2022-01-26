import React, { ChangeEvent, useState } from 'react';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  DatePicker,
  Upload,
  message,
  Steps,
  Divider,
  Modal,
} from 'antd';
import { InboxOutlined } from '@ant-design/icons';

// Page 1
const { TextArea } = Input;

const { Dragger } = Upload;

const props = {
  name: 'file',
  multiple: true,
  action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
  onChange(info: { file: { name?: any; status?: any }; fileList: any }) {
    const { status } = info.file;
    if (status !== 'uploading') {
      console.log(info.file, info.fileList);
    }
    if (status === 'done') {
      message.success(`${info.file.name} file uploaded successfully.`);
    } else if (status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
  onDrop(e: { dataTransfer: { files: any } }) {
    console.log('Dropped files', e.dataTransfer.files);
  },
};


type Props = {
  SetState: React.Dispatch<React.SetStateAction<any>>;
  // data: string;
  // s_comp: string;
  // s_titl: string;
  // s_issu: any;
  // s_deta: string;
  // s_imag: string;
  // s_rema: string;
  // s_star: string;
  // s_numb: string;
  // s_note: string;

};

export const PageOne: React.FC<Props> = ({SetState
  // s_comp,
  // s_titl,
  // s_issu,
  // s_deta,
  // s_imag,
  // s_rema,
  // s_star,
  // s_numb,
  // s_note
}) => {
  const [form] = Form.useForm();
  const [modalSigned, setModalSigned] = React.useState(false);
  const openModal = (modal2Visible: boolean) => {
    setModalSigned(modal2Visible);
  };

  const [comName, setComName] = useState<string>("");
  const [proName, setProName] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [workDetail, setWorkDetail] = useState<string>("");
  // const [proName, setComName] = useState<string>(s_imag);
  const [etcDetail, setEtcDetail] = useState<string>("");
  const [dateStart, setDateStart] = useState<string>("");
  const [numOfpeople, setNumOfpeople] = useState<string>(s_numb);
  const [note, setNote] = useState<string>(s_note);

  const handleComNameChang = (value:string) => {
    setComName(value);
    SetState(() => {
      return {
        s_company_name:value
      };
    });
  }
  const handleProNameChang = (value:string) => {
    console.log(value);
    setProName(value);
    SetState(() => {
      return {
        s_title:value
      };
    });
  }
  const handleDateChang= (value:any) => {
    console.log(value);
    setDate(value);
    SetState(() => {
      return {
        s_issue_date:value
      };
    });
  }
  const handleWorkDetailChang = (value:string) => {
    console.log(value);
    setWorkDetail(value);
    SetState(() => {
      return {
        s_details:value
      };
    });
  }
  const handleEtcDetailChang = (value:string) => {
    // console.log(value);
    setEtcDetail(value);
    SetState(() => {
      return {
        s_remark:value
      };
    });
  }
  const handleDateStartChang = (value:string) => {
    // console.log(value);
    setDateStart(value);
    SetState(() => {
      return {
        s_startdate:value
      };
    });
  }
  const handleNumOfpeopleChang = (value:string) => {
    // console.log(value);
    setNumOfpeople(value);
    SetState(() => {
      return {
        s_number_users:value
      };
    });
  }
  const handleNoteChang = (value:string) => {
    // console.log(value);
    setNote(value);
    SetState(() => {
      return {
        s_note:value
      };
    });
  }

  return (
    <>
      <Form form={form} layout="vertical">
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={8}>
            <Form.Item label="Company Name" required tooltip="This is a required field">
              <Input placeholder="Company Name" onChange={(e)=>{handleComNameChang(e.target.value)}} value={comName} allowClear />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item label="Project Name" required tooltip="This is a required field">
              <Input placeholder="Project Name" onChange={(e)=>{handleProNameChang(e.target.value)}} value={proName} allowClear />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={8}>
            <Form.Item label="Date" required tooltip="This is a required field">
              <DatePicker style={{ width: '100%' }} onChange={(e)=>{handleDateChang}}  />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={24}>
            <Form.Item label="รายละเอียดของงาน" required tooltip="This is a required field">
              <TextArea rows={4} allowClear onChange={(e)=>{handleWorkDetailChang(e.target.value)}} value={workDetail} placeholder="กรอกรายละเอียดงานที่ได้รับมอบหมาย" />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={24}>
            <Form.Item label="รายละเอียดของงาน" required tooltip="This is a required field">
              <Dragger {...props}>
                <p className="ant-upload-drag-icon">
                  <InboxOutlined  />
                </p>
                <p className="ant-upload-text">Click or drag .jpg or .png to this area to upload</p>
              </Dragger>
              ,
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={24}>
            <Form.Item label="อธิบายลักษณะระบบเพิ่มเติม" required tooltip="This is a required field">
              <TextArea rows={4} allowClear onChange={(e)=>{handleEtcDetailChang(e.target.value)}} value={etcDetail} />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={12}>
            <Form.Item label="วันที่ดำเนินการ" required tooltip="This is a required field">
              <DatePicker style={{ width: '100%' }} onChange={(e)=>{handleDateStartChang}}  />
            </Form.Item>
          </Col>
          <Col className="gutter-row" span={12}>
            <Form.Item label="จำนวนคนที่ใช้ (คน)" required tooltip="This is a required field">
              <Input placeholder="Number of People" onChange={(e)=>{handleNumOfpeopleChang(e.target.value)}} value={numOfpeople} allowClear />
            </Form.Item>
          </Col>
        </Row>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" span={24}>
            <Form.Item label="หมายเหตุ" required tooltip="This is a required field">
              <TextArea rows={2} allowClear placeholder="หมายเหตุเพิ่มเติม" onChange={(e)=>{handleNoteChang(e.target.value)}} value={note} />
            </Form.Item>
          </Col>
        </Row>
      </Form>
      <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
        <Col className="gutter-row" span={14}>
          <Form.Item label="ผู้ดำเนินการ">
            <Button type="primary" onClick={() => openModal(true)}>
              เซ้นชื่อ
            </Button>
          </Form.Item>
        </Col>
      </Row>

      <Modal
        title="Vertically centered modal dialog"
        centered
        visible={modalSigned}
        onOk={() => openModal(false)}
        onCancel={() => openModal(false)}
      ></Modal>
    </>
  );
};
