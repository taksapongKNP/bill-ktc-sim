import React, { useState ,useEffect, useContext, useRef } from 'react';
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
  Select,
  Table, Radio, InputNumber,Popconfirm, Typography
} from 'antd';
import moment from 'moment';
import { InboxOutlined } from '@ant-design/icons';
import { getProductAll } from '@/services/backend/api';
import { identity, reject, result } from 'lodash';
import { event } from '@/.umi/plugin-locale/locale';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ReactSketchCanvas } from "react-sketch-canvas";
const EditableContext = React.createContext(null);
// import { PageOne } from './pageOne';
// import { PageTwo } from './pageTwo';


// start Page 1
interface numFile {
  numfile: number;
}
const { TextArea } = Input;

const { Dragger } = Upload;

// end Page 1


// start Page 2

// const { Option } = Select;


// interface IDataRes {
//   id: React.Key;
//   product_code: string;
//   product_name: string;
//   quantity: number | string;
//   unit: string;
//   balance: number | string;
//   stock_status: string;
//   remark: string;
// }

// rowSelection object indicates the need for row selection

// const rowSelection = {
//   onChange: (selectedRowKeys: React.Key[], selectedRows: IDataRes[]) => {
//     console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
//   },
//   getCheckboxProps: (record: IDataRes) => ({
//     disabled: record.product_name === 'Disabled User', // Column configuration not to be checked
//     name: record.product_name,
//   }),
// };

// function onChange(value: any) {
//   console.log(`selected ${value}`);
// }

// function onBlur() {
//   console.log('blur');
// }

// function onFocus() {
//   console.log('focus');
// }

// function onSearch(val: any) {
//   console.log('search:', val);
// }


//end Page 2

const { Step } = Steps;

const styleForm = { marginLeft: '10em', marginRight: '10em', marginTop: '3em' };

const steps = [
  {
    title: 'Page 1',
  },
  {
    title: 'Page 2',
  },
  {
    title: 'Preview',
  },
];


export const SurveyCreate: React.FC<any> = () => {

  const urlBackend = `http://localhost:5000`;
  const token = localStorage.getItem('token');

  // start page 1
  const [form1] = Form.useForm();
  const [modalSigned, setModalSigned] = React.useState(false);
  const openModal = (modal2Visible: boolean) => {
    setModalSigned(modal2Visible);
  };

  const dateToDay = () => {
    var today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    var todayNew = yyyy+'-'+mm+'-'+dd;
    return todayNew;
  }

  const [comName, setComName] = useState<string>("");
  const [proName, setProName] = useState<string>("");
  const [doc_date, setDate] = useState<string>(dateToDay());
  const [workDetail, setWorkDetail] = useState<string>("กรอกรายละเอียดงานที่ได้รับมอบหมาย");
  const [etcDetail, setEtcDetail] = useState<string>("");
  const [dateStart, setDateStart] = useState<string>(dateToDay());
  const [numOfpeople, setNumOfpeople] = useState<string>("");
  const [note, setNote] = useState<string>("หมายเหตุเพิ่มเติม");

  const [nameSignature, setNameSignature] = useState<string>("");
  const [position, setPosition] = useState<string>("1");
  const [dateSignature, setDateSignature] = useState<string>(dateToDay());

  const handleComNameChang = (value:string) => {
    setComName(value);
  }
  const handleProNameChang = (value:string) => {
    setProName(value);
  }
  const handleDateChang= (value:any) => {
    var doc_date = moment(value).format('YYYY-MM-DD');
    setDate(doc_date);
  }
  const handleDateStartChang = (value:any) => {
    var startDate = moment(value).format('YYYY-MM-DD');
    setDateStart(startDate);
  }
  const handleNumOfpeopleChang = (value:string) => {
    setNumOfpeople(value);
  }

  const handleNameSignature = (value:string) => {
    setNameSignature(value);
  }
  const handlePosition = (value:string) => {
    setPosition(value);
  }
  const handleDateSignature = (value:any) => {
    var startDate = moment(value).format('YYYY-MM-DD');
    setDateSignature(startDate);
  }

  const [base64FileArray, setBase64FileArray] = useState(Array);

  const [fileListNew, setFileList] = useState(Array);

  const [testArray, settestArray] = useState(Array);

  const props = {
    name: 'file',
    multiple: true,
    action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    onChange({ file ,fileList:newFileList }:any) {
        // setBase64FileArray([]);
      // settestArray([...testArray,{}])
        setFileList(newFileList);
        if(file.status === 'done'){
          // settestArray([...testArray,file])
          console.log(file);
          // console.log(newFileList);
          // setFileList(newFileList);
          // setBase64FileArray([]);\
          

          var forFileList = fileListNew.length;
          for (let i = 0; i < forFileList; i++) {
            getBase64(fileListNew[i]);
          }
        }

        

        if(file.status ==='removed'){
          // settestArray([...testArray,file])
          console.log(file);
          // setFileList(newFileList);
          
          var forFileList = fileListNew.length;
          for (let i = 0; i < forFileList; i++) {
            getBase64(fileListNew[i]);
          } 
          
          // console.log(newFileList);
        }

      if (status === 'done') {
        message.success(`${file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${file.name} file upload failed.`);
      }
    },
    defaultFileList: fileListNew
    ,
    onDrop(e: { dataTransfer: { files: any } }) {
      console.log('Dropped files', e.dataTransfer.files);
    },
  };

  

  const setObjectFile = (base:never) => {
    setBase64FileArray([...base64FileArray,base]);
    // console.log(typeof(base));
  }

  const getBase64 = (event:any) => {
    // console.log(event.originFileObj);
    let file = event.originFileObj;
    let reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = function () {
      // console.log(reader.result);
      setObjectFile(reader.result);
      // return (reader.result);
    };
    reader.onerror = function (error) {
      console.log('Error: ', error);
    };
  }

  //canvas

  const [isSignature, setIsSignature] = useState<string>("");
  const okCasvas = () => {
    const canvas = canvasRef.current;
    var pngUrl = canvas.toDataURL();
    console.log(pngUrl);
    setIsSignature(pngUrl);
    openModal(false)
  }
  const [isDrawing, setIsDrawing] = useState(false)
  const canvasRef:any = useRef(null);
  const contextRef:any = useRef(null);
  const showCasVasInModal = async() => {
   await openModal(true);
      const canvas:any = canvasRef.current;
      canvas.width = 470 * 2;
      canvas.height = 200* 2;
      canvas.style.width = `470px`;
      canvas.style.height = `200px`;
      canvas.style.background = `#f0f2f5`;
  
      const context = canvas.getContext("2d")
      context.scale(2, 2);
      context.lineCap = "round";
      context.strokeStyle = "black";
      context.lineWidth = 5;
      contextRef.current = context; 
  }
  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const finishDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) {
      return;
    }
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };
   //canvas

  // end page 1

// start Page 2
const { Option } = Select;

interface DataType {
  key: React.Key;
  product_code: string;
  product_name: string;
  quantity: string;
  unit: string;
  balance: string;
  stock_status: string;
}

interface EditableCellProps extends React.HTMLAttributes<HTMLElement> {
  editing: boolean;
  dataIndex: string;
  title: any;
  inputType: 'number' | 'text';
  record: DataType;
  index: number;
  children: React.ReactNode;
}

const EditableCell: React.FC<EditableCellProps> = ({
  editing,
  dataIndex,
  title,
  inputType,
  record,
  index,
  children,
  ...restProps
}) => {
  const inputNode = inputType === 'number' ? <InputNumber /> : <Input />;

  return (
    <td {...restProps}>
      {editing ? (
        <Form.Item
          name={dataIndex}
          style={{ margin: 0 }}
          rules={[
            {
              required: true,
              type:'number',
              min:1,
              message: `กรุณากรอก ${title}!`,
            },
          ]}
        >
          {inputNode}
        </Form.Item>
      ) : (
        children
      )}
    </td>
  );
};

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
    editable: true,
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
    title: 'Action',
    dataIndex: 'operation',
    render: (_: any, record: { key: React.Key }) => {
      const editable = isEditing(record);
      return editable ? (
        <span>
          <a href="javascript:;" onClick={() => save(record.key)} style={{ marginRight: 8 }}>
            Save
          </a>
          <Popconfirm title="Sure to cancel?" onConfirm={cancel}>
            <a>Cancel</a>
          </Popconfirm>
        </span>
      ) : (
        <Typography.Link disabled={editingKey !== ''} onClick={() => edit(record)}>
          Edit
        </Typography.Link>
      );
    },
  },
  {
    title: 'operation',
    dataIndex: 'operation',
    render: (_: any, record: { key: React.Key }) =>
    stateDataSource.length >= 1 ? (
        <Popconfirm title="Sure to delete?" onConfirm={() => handleDelete(record.key)}>
          <a>Delete</a>
        </Popconfirm>
      ) : null,
  },
];



const [form2] = Form.useForm();
const [resData, setResData] = useState<DataType[]>([]);
const [input_product_num, setInput_product_num] = useState("");
const [select_product, setSelect_product] = useState("");

//rowSelection object indicates the need for row selection

const rowSelection = {
  onChange: (selectedRowKeys: React.Key[], selectedRows: DataType[]) => {
    console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
  },
  getCheckboxProps: (record: DataType) => ({
    disabled: record.product_name === 'Disabled User', // Column configuration not to be checked
    name: record.product_name,
  }),
};

function onChange(value: any) {
  console.log(`selected ${value}`);
  setSelect_product(value);
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




interface DataSelectProductType {
  value: number;
  product_code: string;
  product_name: string;
  address: string;
}


useEffect(() => {
  (async function fetchdata() {
    const dataRes = await getProductAll();
    setResData(dataRes);
  })();
}, []);

const [ stateDataSource, setStateDataSource ] = useState<DataType[]>([]);
const [ countDataSource, setCountDataSource ] = useState<number>(1);

const handleDelete = (key: React.Key) => {
  setStateDataSource(stateDataSource.filter((item) => item.key !== key));
};

const handleAddProduct =()=>{


  const newData: DataType = {
    key: countDataSource,
    product_code: select_product,
    product_name: select_product,
    quantity: input_product_num,
    unit: 'Edward King 1',
    balance: '32',
    stock_status: 'London, Park Lane no. 1',
  }

  setCountDataSource(countDataSource + 1);
  setStateDataSource([...stateDataSource,newData]);

}

  const [editingKey, setEditingKey] = useState('');

  const isEditing = (record: DataType) => record.key === editingKey;

  const edit = (record: Partial<DataType> & { key: React.Key }) => {
    form2.setFieldsValue({ quantity: '', ...record });
  
    setEditingKey(record.key);
    // console.log(typeof(record.key) + " ------- 12311111111111111111111111111111 ------- " + editingKey);
  };

  const cancel = () => {
    setEditingKey('');
  };

  const save = async (key: React.Key) => {
    try {
      const row = (await form2.validateFields()) as DataType;

      const newData = [...stateDataSource];
      const index = newData.findIndex(item => key === item.key);
      if (index > -1) {
        const item = newData[index];
        newData.splice(index, 1, {
          ...item,
          ...row,
        });
        console.log(newData + "------- ipdate");
        setStateDataSource(newData);
        setEditingKey('');
      } else {
        newData.push(row);
        setStateDataSource(newData);
        setEditingKey('');
      }
    } catch (errInfo) {
      console.log('Validate Failed:', errInfo);
    }
  };

  const mergedColumns = columns.map(col => {
    if (!col.editable) {
      return col;
    }
    return {
      ...col,
      onCell: (record: DataType) => ({
        record,
        inputType: col.dataIndex === 'quantity' ? 'number' : 'number',
        dataIndex: col.dataIndex,
        title: col.title,
        editing: isEditing(record),
      }),
    };
  });




//end Page 2


  // start Done
  const submitDone = () => {
    const data = {
      company_name: comName,
      title: proName,
      doc_date: doc_date,
      details: workDetail,
      illustration: "",
      issue_date: dateStart,
      number_users: numOfpeople,
      remark: etcDetail,
      node: note,
      operator_signed: isSignature,
      operator_name: nameSignature,
      operator_position: position,
      operator_date: dateSignature,
      status: "Register"
    }

    // console.log(data);

    axios({
      method: 'post',
      url: urlBackend + '/api/survey',
      headers: {Authorization: `Beared ${token}`}, 
      data: data
    }).then(res => {
      console.log(res);
      message.success('Processing complete!')
    })

    // for (let i = 0; i < fileListNew.length; i++) {
    //   console.log(fileListNew[i]);
    //   getBase64(fileListNew[i]);
    // }
    

    // console.log({base64FileArray});
    // // console.log({testArray});
    // console.log({fileListNew});
    // console.log({isSignature});
    // console.log(fileListNew.length);
  }
  // end Done


  const [currentPage, setCurrent] = React.useState(0);

  const next = () => {
    setCurrent(currentPage + 1);
  };

  const prev = () => {
    setCurrent(currentPage - 1);
  };

 

  return (
    <>
      <Steps current={currentPage}>
        {steps.map((item) => (
          <Step key={item.title} title={item.title} />
        ))}
      </Steps>
      <div className="steps-content">
        {currentPage + 1 === 1 && (
          <div id="stepForm1" style={styleForm}>
            {/* start page 1    */}
            <>
              <Form form={form1} layout="vertical">
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
                      <DatePicker style={{ width: '100%' }} onChange={handleDateChang} defaultValue={moment(doc_date, 'YYYY/MM/DD')}   />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={24}>
                    <Form.Item label="รายละเอียดของงาน" required tooltip="This is a required field">
                      <CKEditor
                          editor={ ClassicEditor }
                          data={workDetail}
                          onReady={ editor => {
                              // You can store the "editor" and use when it is needed.
                              // console.log( 'Editor is ready to use!', editor );
                          } }
                          onChange={ ( event:any, editor:any ) => {
                              const data = editor.getData();
                              // console.log( { event, editor, data } );
                              setWorkDetail(data);
                          } }
                          onBlur={ ( event, editor ) => {
                              // console.log( 'Blur.', editor );
                          } }
                          onFocus={ ( event, editor ) => {
                              // console.log( 'Focus.', editor );
                          } }
                      />
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
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item label="อธิบายลักษณะระบบเพิ่มเติม" required tooltip="This is a required field">
                      <CKEditor
                            editor={ ClassicEditor }
                            data={etcDetail}
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                // console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event:any, editor:any ) => {
                                const data = editor.getData();
                                // console.log( { event, editor, data } );
                                setEtcDetail(data);
                            } }
                            onBlur={ ( event, editor ) => {
                                // console.log( 'Blur.', editor );
                            } }
                            onFocus={ ( event, editor ) => {
                                // console.log( 'Focus.', editor );
                            } }
                        />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label="วันที่ดำเนินการ" required tooltip="This is a required field">
                      <DatePicker style={{ width: '100%' }} onChange={handleDateStartChang} defaultValue={moment(dateStart, 'YYYY/MM/DD')}  />
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
                      <CKEditor
                          editor={ ClassicEditor }
                          data={note}
                          onReady={ editor => {
                              // You can store the "editor" and use when it is needed.
                              // console.log( 'Editor is ready to use!', editor );
                          } }
                          onChange={ ( event:any, editor:any ) => {
                              const data = editor.getData();
                              // console.log( { event, editor, data } );
                              setNote(data);
                          } }
                          onBlur={ ( event, editor ) => {
                              // console.log( 'Blur.', editor );
                          } }
                          onFocus={ ( event, editor ) => {
                              // console.log( 'Focus.', editor );
                          } }
                        />
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={14}>
                  <Form.Item label="ลงชื่อผู้ดำเนินการ" required tooltip="This is a required field">
                    <Button type="primary" onClick={() => showCasVasInModal()}>
                      เซ้นชื่อ
                    </Button>
                  </Form.Item>
                </Col>
              </Row>

              <Modal
                title="Vertically centered modal dialog"
                centered
                visible={modalSigned}
                onOk={() => {
                  okCasvas();
                }}
                onCancel={() => openModal(false)}
              >
                <div>
                <canvas 
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    ref={canvasRef}
                    />
                    <br>
                    </br>
                    <Input placeholder="ลงชื่อ" onChange={(e)=>{handleNameSignature(e.target.value)}} value={nameSignature} allowClear />
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="เลือกตำแหน่ง"
                      optionFilterProp="children"
                      filterOption={(input, option) =>
                        option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                      }
                      filterSort={(optionA, optionB) =>
                        optionA.children.toLowerCase().localeCompare(optionB.children.toLowerCase())
                      }
                      defaultValue={position}
                      onChange={handlePosition}
                    >
                      <Option value="1">เลือกตำแหน่ง</Option>
                      <Option value="2">Closed</Option>
                      <Option value="3">Communicated</Option>
                      <Option value="4">Identified</Option>
                      <Option value="5">Resolved</Option>
                      <Option value="6">Cancelled</Option>
                      <Option value="7">Not Identifi</Option>
                      <Option value="8">Clos</Option>
                      <Option value="9">Communicat</Option>
                      <Option value="10">Identifi</Option>
                      <Option value="11">Resolv</Option>
                      <Option value="12">Cancell</Option>
                      <Option value="13">Not Identifi</Option>
                      <Option value="14">Clos</Option>
                      <Option value="15">Communicat</Option>
                      <Option value="16">Identifi</Option>
                      <Option value="17">Resolv</Option>
                      <Option value="18">Cancell</Option>
                    </Select>
                    <DatePicker style={{ width: '100%' }} onChange={handleDateSignature} defaultValue={moment(dateSignature, 'YYYY/MM/DD')}  />
                   
                </div>
              </Modal>
            </>  
            {/* end page 1    */}
          </div>
        )}
        {currentPage + 1 === 2 && (
          <div id="stepForm2" style={styleForm}>

            {/* start Page 2 */}
            <div>
                  <Form form={form2} layout="">
                    <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                      
                      <Col className="gutter-row" span={5}>
                        <Form.Item label="รหัสสินค้า / รายการ" required tooltip="This is a required field">
                        <Select
                            showSearch
                            style={{ width: 200 }}
                            placeholder="Select a equipment"
                            optionFilterProp="children"
                            onChange={onChange}
                            onFocus={onFocus}
                            onBlur={onBlur}
                            onSearch={onSearch}
                          >
                            {resData.map((option) => (
                              <Option  value={option.product_code}>
                                {option.product_code} /{option.product_name}{' '}
                              </Option>
                            ))}
                          </Select>
                        </Form.Item>
                      </Col>

                      <Col className="gutter-row" span={5}>
                        <Form.Item label="จำนวน" required tooltip="This is a required field">
                          <InputNumber id="input_product_num" min={1} max={1000} defaultValue={0} style={{ width: '100%' }} onChange={(e) => setInput_product_num(e)} />
                        </Form.Item>
                      </Col>
                      <Col className="gutter-row" span={2}>
                        <Form.Item>
                          <Button onClick={handleAddProduct} type="primary" style={{ marginBottom: 16 ,marginTop: 30}} >
                            Add
                          </Button>
                        </Form.Item>
                      </Col>
                    </Row>
                    <Row>
                      <Col span={24}>
                        <Table
                            components={{
                              body: {
                                cell: EditableCell,
                              },
                            }}
                          columns={mergedColumns}
                          rowClassName="editable-row"
                          pagination={{
                            onChange: cancel,
                          }}
                          bordered
                          dataSource={stateDataSource}
                          title={() => 'รายการอุปกรณ์'}
                        />
                      </Col>
                    </Row>
                  </Form>
                </div>
            {/* end Page 2 */}
          </div>
        )}
        {currentPage + 1 === 3 && <div id="stepForm3">3</div>}
      </div>

      <Divider />

      <div className="steps-action" style={{ textAlign: 'center' }}>
        {currentPage < steps.length - 1 && (
          <Button type="primary" onClick={() => next()}>
            Next
          </Button>
        )}
        {currentPage === steps.length - 1 && (
          // <Button type="primary" onClick={() => message.success('Processing complete!')}>
          //   Done
          // </Button>
          <Button type="primary" onClick={() => submitDone()}>
            Done
          </Button>
        )}
        {currentPage > 0 && (
          <Button style={{ margin: '0 8px' }} onClick={() => prev()}>
            Previous
          </Button>
        )}
      </div>
    </>
  );
};
