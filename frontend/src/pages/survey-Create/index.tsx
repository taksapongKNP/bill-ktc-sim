/* eslint-disable func-names */
/* eslint-disable no-plusplus */
/* eslint-disable no-console */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-use-before-define */
import React, { useState ,useEffect, useContext, useRef } from 'react';
import { Form,Input,Button,Row,Col,DatePicker,Upload,message,Steps,Divider,Modal,Select,Table,Radio, InputNumber,Popconfirm, Typography } from 'antd';
import moment from 'moment';
import { InboxOutlined } from '@ant-design/icons';
import { getProductAll, getProductByProCode ,getPositionsAll,imageInsert,imageInsertmultirows } from '@/services/backend/api';
import { identity, reject, result } from 'lodash';
import { event } from '@/.umi/plugin-locale/locale';
import axios from 'axios';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ReactSketchCanvas } from "react-sketch-canvas";
import SignatureCanvas from 'react-signature-canvas';

const EditableContext = React.createContext(null);
// import { PageOne } from './pageOne';
// import { PageTwo } from './pageTwo';


// start Page 1
interface numFile {
  numfile: number;
}
const { TextArea } = Input;

const { Dragger } = Upload;

const { Option } = Select;
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


// end Page 2

const { Step } = Steps;

const styleForm = { marginLeft: '10em', marginRight: '10em', marginTop: '3em' };

const steps = [
  {
    title: 'Page 1',
  },
  {
    title: 'Page 2',
  },
  // {
  //   title: 'Preview',
  // },
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
    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); // January is 0!
    let yyyy = today.getFullYear();

    let todayNew = `${yyyy}-${mm}-${dd}`;
    return todayNew;
  }

  interface DataTypePositions {
    key: React.Key;
    position_code: string;
    position_name_en: string;
    position_name_th: string;
  }

  const [comName, setComName] = useState<string>("");
  const [proName, setProName] = useState<string>("");
  const [doc_date, setDate] = useState<string>(dateToDay());
  const [workDetail, setWorkDetail] = useState<string>("");
  const [etcDetail, setEtcDetail] = useState<string>("");
  const [dateStart, setDateStart] = useState<string>(dateToDay());
  const [numOfpeople, setNumOfpeople] = useState<string>("");
  const [notes, setNote] = useState<string>("");
  const [nameSignature, setNameSignature] = useState<string>("");
  const [position, setPosition] = useState<string>("เลือกตำแหน่ง");
  const [dateSignature, setDateSignature] = useState<string>(dateToDay());
  const [base64FileArray, setBase64FileArray] = useState([]);
  const [checkbutton, setBheckbutton] = useState(false);
  const [fileListNew, setFileList] = useState(Array);
  const [posiotionsArray, setPositions] = useState<DataTypePositions[]>([]);
  const [checknameSignature, setchecknameSignature] = useState(false);
  const [checkPosition, setcheckPosition] = useState(false);

  const handleComNameChang = (value: string) => {
    setComName(value);
  }
  const handleProNameChang = (value: string) => {
    setProName(value);
  }
  const handleDateChang= (value: any) => {
    let doc_date = moment(value).format('YYYY-MM-DD');
    setDate(doc_date);
  }
  const handleDateStartChang = (value: any) => {
    let startDate = moment(value).format('YYYY-MM-DD');
    setDateStart(startDate);
  }
  const handleNumOfpeopleChang = (value: string) => {
    setNumOfpeople(value);
  }

  const handleNameSignature = (value: string) => {
    setNameSignature(value);
  }
  const handlePosition = (value: string) => {
    setPosition(value);
  }
  const handleDateSignature = (value: any) => {
    let startDate = moment(value).format('YYYY-MM-DD');
    setDateSignature(startDate);
  }

  // const [testArray, settestArray] = useState(Array);

  // const [dataResPositons, settestArray] = useState(Array);

  const props = {
    name: 'file',
    multiple: true,
    showUploadList: true,
    // action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
    action: 'https://jsonplaceholder.typicode.com/posts/',
    onChange({ file ,fileList:newFileList }: any) {
      console.log(file)
      const {status} = file;
        setFileList(newFileList);
        if(status === 'done'){
          let forFileList = fileListNew.length;
          for (let i = 0; i < forFileList; i++) {
             getBase64(fileListNew[i]);
          }
        }
        if(status ==='removed'){
          let forFileList = fileListNew.length;
          for (let i = 0; i < forFileList; i++) {
            getBase64(fileListNew[i]);
          }
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



  const setObjectFile = (base: never) => {
    setBase64FileArray([...base64FileArray,base]);
    // console.log(typeof(base));
  }

  const getBase64 = (event: any) => {
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

  // canvas


  const [isSignature, setIsSignature] = useState<string>("");
  const okCasvas = async () => {
    if(nameSignature === '') {
      console.log(nameSignature);
      message.error("กรุณาลงชื่อ");
      document.getElementById('nameinmodel')?.focus();
      return;
    }
    if (position === 'เลือกตำแหน่ง') {
      console.log(position)
      message.error("กรุณาเลือกตำแหน่ง");
      return;
    }
    if(isSignature === ''){
      message.error("กรุณาเซ็นชื่อ");
      // eslint-disable-next-line no-useless-return
    return;
    }
    // const canvas = canvasRef.current;
    // let pngUrl = canvas.toDataURL();
    // setIsSignature(pngUrl);
    openModal(false)
  }

  let sigPad = {};
  // const [isDrawing, setIsDrawing] = useState(false)
  // const canvasRef: any = useRef(null);
  // const contextRef: any = useRef(null);

  const showCasVasInModal = async() => {
   await openModal(true);
  }

  const endSignager = () => {
    let pngUrl = sigPad.getTrimmedCanvas().toDataURL('image/png');
    setIsSignature(pngUrl);
  }

  const clearSignatuer = () =>{
    sigPad.clear();
    const index = setIsSignature('');
    const newFileList = index;
    return {
      isSignature: newFileList,
    };
  };


   // canvas

   const positionSelect = [];
  // for (let i = 10; i < 36; i++) {
  //   positionSelect.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  // }

   useEffect(() => {

    (async function fetchdata() {
      const dataResPositons = await getPositionsAll();
      // console.log(dataResPositons);
      setPositions(dataResPositons);

    })();
  }, []);

  // console.log(posiotionsArray);

  // for (let key in posiotionsArray) {
    // console.log(posiotionsArray);
    // positionSelect.push(<Option key={posiotionsArray[key].position_code.toString}>{posiotionsArray[key].position_name_en.toString}</Option>);
  // }

  // for (let key in dataResPositons) {
  //   let value = dataResPositons[key];
  //   console.log(value.product_code);
  //   // Use `key` and `value`
  // }


  // const positionSelect = [];
  // for (let i = 10; i < 38; i++) {
  //   positionSelect.push(<Option key={i.toString(36) + i}>{i.toString(36) + i}</Option>);
  // }
  // end page 1

// start Page 2


interface DataType {
  key: React.Key;
  product_code: string;
  product_name: string;
  quantity: number;
  unit: string;
  balance: number;
  stock_status: string;
  totalStock: number;
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
const [input_product_num, setInput_product_num] = useState<number>(0);
const [select_product, setSelect_product] = useState("");

// rowSelection object indicates the need for row selection

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

const  handleAddProduct = async()=>{
  const proDuctSelect = getProductByProCode(select_product);
  const productcode = document.getElementById('productcode');
  if(select_product === '') {
    message.error('กรุณากรอกรหัสสินค้า / รายการ');
    productcode.focus();
  } else {
    proDuctSelect.then(res =>{
      // console.log(res[0].product_name);
      const proNum = res[0].product_num - input_product_num;
      const newData: DataType = {
        key: countDataSource,
        product_code: res[0].product_code,
        product_name: res[0].product_name,
        quantity: input_product_num,
        unit:  res[0].product_unit,
        balance:  proNum,
        stock_status:  res[0].product_status,
        totalStock:  res[0].product_num,
      }
      setCountDataSource(countDataSource + 1);
      setStateDataSource([...stateDataSource,newData]);
    });
  }


}

const checkDataInSelect = () => {

   for (let key in resData) {
    let value = resData[key];
    console.log(value.product_code);
    // Use `key` and `value`
  }

  for (let key in stateDataSource) {
    let value = stateDataSource[key];
    console.log(`${value.product_code  } ---- `);
    // Use `key` and `value`
  }
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
        const totalSum = Number(item.totalStock - row.quantity);
        const newDataRow = {"quantity":row.quantity,"balance":totalSum}
        newData.splice(index, 1, {
          ...item,
          ...newDataRow,
        });
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





// end Page 2


  // start Done
  const submitDone = async () => {
    const data = {
      company_name: comName,
      title: proName,
      doc_date,
      details: workDetail,
      illustration: "",
      issue_date: dateStart,
      number_users: numOfpeople,
      remark: etcDetail,
      note: notes,
      operator_signed: isSignature,
      operator_name: nameSignature,
      operator_position: position,
      operator_date: dateSignature,
      status: "Register"
    }
    let surCode;
    // commitServayfrom(data).then(res => {
    //   console.log(res.data.surveyCode);
    //   surCode = res.data.surveyCode;
    //   insertSurveyDetail(surCode);
    //   // insertSurveyImage(surCode);
    //   message.success('Processing complete!')
    // });
    axios({
      method: 'post',
      url: `${urlBackend  }/api/survey`,
      headers: {Authorization: `Beared ${token}`},
      data
    }).then(res => {
      console.log(res.data.surveyCode);
      surCode = res.data.surveyCode;
      insertSurveyDetail(surCode);
      insertSurveyImage(surCode);
      message.success('Processing complete!')
    })

    for (let i = 0; i < fileListNew.length; i++) {
      console.log(fileListNew[i]);
      getBase64(fileListNew[i]);
    }
    // window.location = "http://localhost:8000/list";
    window.location.reload();
  }
  const insertSurveyDetail = async (surCode: any) => {
    for (let key in stateDataSource) {
      let value = stateDataSource[key];
      const dataProduct = {
        survey_code: surCode,
        product_code: value.product_code,
        product_name: value.product_name,
        quantity: value.quantity,
        unit: value.unit,
        balance: value.totalStock,
        stock_status: value.product_code,
        remark: ""
      }
        axios({
        method: 'post',
        url: `${urlBackend  }/api/surveyDetails`,
        headers: {Authorization: `Beared ${token}`},
        data: dataProduct
      }).then(res => {
        console.log(res);
        // message.success('Processing complete!');
      })
    }
  }


  const insertSurveyImage = async (surCode: any) => {
    if(base64FileArray.length > 1){
    const imageArr = [];
    const forimage = base64FileArray.length;
      for (var r = 0; r < forimage; r++) {
        imageArr.push({survey_code: surCode,image_sequence: 1,images : base64FileArray[r]});
      }
    imageInsertmultirows(imageArr);
    }else {
      const dataImage = {
        survey_code: surCode,
        image_sequence: 1,
        images: base64FileArray[0]
      }
    imageInsert(dataImage);
    }
    // for (let key in stateDataSource) {
    //   let value = stateDataSource[key];
    //   console.log(value);
    //   // const dataProduct = {
    //   //   survey_code: surCode,
    //   //   image_sequence: value.product_code,
    //   //   images: value.product_name,
    //   // }
    //   //   axios({
    //   //   method: 'post',
    //   //   url: urlBackend + '/api/surveyDetails',
    //   //   headers: {Authorization: `Beared ${token}`},
    //   //   data: dataProduct
    //   // }).then(res => {
    //   //   console.log(res);
    //   //   // message.success('Processing complete!');
    //   // })
    // }
  }

  // end Done


  const [currentPage, setCurrent] = React.useState(0);

  const next = () => {
    const imagenull = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAA6wAAAGQCAYAAACqHO27AAAAAXNSR0IArs4c6QAAHUxJREFUeF7t1zERAAAMArHi33Rt/JAq4EIXdo4AAQIECBAgQIAAAQIECAQFFswkEgECBAgQIECAAAECBAgQOIPVExAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIGCw+gECBAgQIECAAAECBAgQSAoYrMlahCJAgAABAgQIECBAgAABg9UPECBAgAABAgQIECBAgEBSwGBN1iIUAQIECBAgQIAAAQIECBisfoAAAQIECBAgQIAAAQIEkgIGa7IWoQgQIECAAAECBAgQIEDAYPUDBAgQIECAAAECBAgQIJAUMFiTtQhFgAABAgQIECBAgAABAgarHyBAgAABAgQIECBAgACBpIDBmqxFKAIECBAgQIAAAQIECBAwWP0AAQIECBAgQIAAAQIECCQFDNZkLUIRIECAAAECBAgQIECAgMHqBwgQIECAAAECBAgQIEAgKWCwJmsRigABAgQIECBAgAABAgQMVj9AgAABAgQIECBAgAABAkkBgzVZi1AECBAgQIAAAQIECBAgYLD6AQIECBAgQIAAAQIECBBIChisyVqEIkCAAAECBAgQIECAAAGD1Q8QIECAAAECBAgQIECAQFLAYE3WIhQBAgQIECBAgAABAgQIGKx+gAABAgQIECBAgAABAgSSAgZrshahCBAgQIAAAQIECBAgQMBg9QMECBAgQIAAAQIECBAgkBQwWJO1CEWAAAECBAgQIECAAAECBqsfIECAAAECBAgQIECAAIGkgMGarEUoAgQIECBAgAABAgQIEDBY/QABAgQIECBAgAABAgQIJAUM1mQtQhEgQIAAAQIECBAgQICAweoHCBAgQIAAAQIECBAgQCApYLAmaxGKAAECBAgQIECAAAECBAxWP0CAAAECBAgQIECAAAECSQGDNVmLUAQIECBAgAABAgQIECBgsPoBAgQIECBAgAABAgQIEEgKGKzJWoQiQIAAAQIECBAgQIAAAYPVDxAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIGCw+gECBAgQIECAAAECBAgQSAoYrMlahCJAgAABAgQIECBAgAABg9UPECBAgAABAgQIECBAgEBSwGBN1iIUAQIECBAgQIAAAQIECBisfoAAAQIECBAgQIAAAQIEkgIGa7IWoQgQIECAAAECBAgQIEDAYPUDBAgQIECAAAECBAgQIJAUMFiTtQhFgAABAgQIECBAgAABAgarHyBAgAABAgQIECBAgACBpIDBmqxFKAIECBAgQIAAAQIECBAwWP0AAQIECBAgQIAAAQIECCQFDNZkLUIRIECAAAECBAgQIECAgMHqBwgQIECAAAECBAgQIEAgKWCwJmsRigABAgQIECBAgAABAgQMVj9AgAABAgQIECBAgAABAkkBgzVZi1AECBAgQIAAAQIECBAgYLD6AQIECBAgQIAAAQIECBBIChisyVqEIkCAAAECBAgQIECAAAGD1Q8QIECAAAECBAgQIECAQFLAYE3WIhQBAgQIECBAgAABAgQIGKx+gAABAgQIECBAgAABAgSSAgZrshahCBAgQIAAAQIECBAgQMBg9QMECBAgQIAAAQIECBAgkBQwWJO1CEWAAAECBAgQIECAAAECBqsfIECAAAECBAgQIECAAIGkgMGarEUoAgQIECBAgAABAgQIEDBY/QABAgQIECBAgAABAgQIJAUM1mQtQhEgQIAAAQIECBAgQICAweoHCBAgQIAAAQIECBAgQCApYLAmaxGKAAECBAgQIECAAAECBAxWP0CAAAECBAgQIECAAAECSQGDNVmLUAQIECBAgAABAgQIECBgsPoBAgQIECBAgAABAgQIEEgKGKzJWoQiQIAAAQIECBAgQIAAAYPVDxAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIGCw+gECBAgQIECAAAECBAgQSAoYrMlahCJAgAABAgQIECBAgAABg9UPECBAgAABAgQIECBAgEBSwGBN1iIUAQIECBAgQIAAAQIECBisfoAAAQIECBAgQIAAAQIEkgIGa7IWoQgQIECAAAECBAgQIEDAYPUDBAgQIECAAAECBAgQIJAUMFiTtQhFgAABAgQIECBAgAABAgarHyBAgAABAgQIECBAgACBpIDBmqxFKAIECBAgQIAAAQIECBAwWP0AAQIECBAgQIAAAQIECCQFDNZkLUIRIECAAAECBAgQIECAgMHqBwgQIECAAAECBAgQIEAgKWCwJmsRigABAgQIECBAgAABAgQMVj9AgAABAgQIECBAgAABAkkBgzVZi1AECBAgQIAAAQIECBAgYLD6AQIECBAgQIAAAQIECBBIChisyVqEIkCAAAECBAgQIECAAAGD1Q8QIECAAAECBAgQIECAQFLAYE3WIhQBAgQIECBAgAABAgQIGKx+gAABAgQIECBAgAABAgSSAgZrshahCBAgQIAAAQIECBAgQMBg9QMECBAgQIAAAQIECBAgkBQwWJO1CEWAAAECBAgQIECAAAECBqsfIECAAAECBAgQIECAAIGkgMGarEUoAgQIECBAgAABAgQIEDBY/QABAgQIECBAgAABAgQIJAUM1mQtQhEgQIAAAQIECBAgQICAweoHCBAgQIAAAQIECBAgQCApYLAmaxGKAAECBAgQIECAAAECBAxWP0CAAAECBAgQIECAAAECSQGDNVmLUAQIECBAgAABAgQIECBgsPoBAgQIECBAgAABAgQIEEgKGKzJWoQiQIAAAQIECBAgQIAAAYPVDxAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIGCw+gECBAgQIECAAAECBAgQSAoYrMlahCJAgAABAgQIECBAgAABg9UPECBAgAABAgQIECBAgEBSwGBN1iIUAQIECBAgQIAAAQIECBisfoAAAQIECBAgQIAAAQIEkgIGa7IWoQgQIECAAAECBAgQIEDAYPUDBAgQIECAAAECBAgQIJAUMFiTtQhFgAABAgQIECBAgAABAgarHyBAgAABAgQIECBAgACBpIDBmqxFKAIECBAgQIAAAQIECBAwWP0AAQIECBAgQIAAAQIECCQFDNZkLUIRIECAAAECBAgQIECAgMHqBwgQIECAAAECBAgQIEAgKWCwJmsRigABAgQIECBAgAABAgQMVj9AgAABAgQIECBAgAABAkkBgzVZi1AECBAgQIAAAQIECBAgYLD6AQIECBAgQIAAAQIECBBIChisyVqEIkCAAAECBAgQIECAAAGD1Q8QIECAAAECBAgQIECAQFLAYE3WIhQBAgQIECBAgAABAgQIGKx+gAABAgQIECBAgAABAgSSAgZrshahCBAgQIAAAQIECBAgQMBg9QMECBAgQIAAAQIECBAgkBQwWJO1CEWAAAECBAgQIECAAAECBqsfIECAAAECBAgQIECAAIGkgMGarEUoAgQIECBAgAABAgQIEDBY/QABAgQIECBAgAABAgQIJAUM1mQtQhEgQIAAAQIECBAgQICAweoHCBAgQIAAAQIECBAgQCApYLAmaxGKAAECBAgQIECAAAECBAxWP0CAAAECBAgQIECAAAECSQGDNVmLUAQIECBAgAABAgQIECBgsPoBAgQIECBAgAABAgQIEEgKGKzJWoQiQIAAAQIECBAgQIAAAYPVDxAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIGCw+gECBAgQIECAAAECBAgQSAoYrMlahCJAgAABAgQIECBAgAABg9UPECBAgAABAgQIECBAgEBSwGBN1iIUAQIECBAgQIAAAQIECBisfoAAAQIECBAgQIAAAQIEkgIGa7IWoQgQIECAAAECBAgQIEDAYPUDBAgQIECAAAECBAgQIJAUMFiTtQhFgAABAgQIECBAgAABAgarHyBAgAABAgQIECBAgACBpIDBmqxFKAIECBAgQIAAAQIECBAwWP0AAQIECBAgQIAAAQIECCQFDNZkLUIRIECAAAECBAgQIECAgMHqBwgQIECAAAECBAgQIEAgKWCwJmsRigABAgQIECBAgAABAgQMVj9AgAABAgQIECBAgAABAkkBgzVZi1AECBAgQIAAAQIECBAgYLD6AQIECBAgQIAAAQIECBBIChisyVqEIkCAAAECBAgQIECAAAGD1Q8QIECAAAECBAgQIECAQFLAYE3WIhQBAgQIECBAgAABAgQIGKx+gAABAgQIECBAgAABAgSSAgZrshahCBAgQIAAAQIECBAgQMBg9QMECBAgQIAAAQIECBAgkBQwWJO1CEWAAAECBAgQIECAAAECBqsfIECAAAECBAgQIECAAIGkgMGarEUoAgQIECBAgAABAgQIEDBY/QABAgQIECBAgAABAgQIJAUM1mQtQhEgQIAAAQIECBAgQICAweoHCBAgQIAAAQIECBAgQCApYLAmaxGKAAECBAgQIECAAAECBAxWP0CAAAECBAgQIECAAAECSQGDNVmLUAQIECBAgAABAgQIECBgsPoBAgQIECBAgAABAgQIEEgKGKzJWoQiQIAAAQIECBAgQIAAAYPVDxAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIGCw+gECBAgQIECAAAECBAgQSAoYrMlahCJAgAABAgQIECBAgAABg9UPECBAgAABAgQIECBAgEBSwGBN1iIUAQIECBAgQIAAAQIECBisfoAAAQIECBAgQIAAAQIEkgIGa7IWoQgQIECAAAECBAgQIEDAYPUDBAgQIECAAAECBAgQIJAUMFiTtQhFgAABAgQIECBAgAABAgarHyBAgAABAgQIECBAgACBpIDBmqxFKAIECBAgQIAAAQIECBAwWP0AAQIECBAgQIAAAQIECCQFDNZkLUIRIECAAAECBAgQIECAgMHqBwgQIECAAAECBAgQIEAgKWCwJmsRigABAgQIECBAgAABAgQMVj9AgAABAgQIECBAgAABAkkBgzVZi1AECBAgQIAAAQIECBAgYLD6AQIECBAgQIAAAQIECBBIChisyVqEIkCAAAECBAgQIECAAAGD1Q8QIECAAAECBAgQIECAQFLAYE3WIhQBAgQIECBAgAABAgQIGKx+gAABAgQIECBAgAABAgSSAgZrshahCBAgQIAAAQIECBAgQMBg9QMECBAgQIAAAQIECBAgkBQwWJO1CEWAAAECBAgQIECAAAECBqsfIECAAAECBAgQIECAAIGkgMGarEUoAgQIECBAgAABAgQIEDBY/QABAgQIECBAgAABAgQIJAUM1mQtQhEgQIAAAQIECBAgQICAweoHCBAgQIAAAQIECBAgQCApYLAmaxGKAAECBAgQIECAAAECBAxWP0CAAAECBAgQIECAAAECSQGDNVmLUAQIECBAgAABAgQIECBgsPoBAgQIECBAgAABAgQIEEgKGKzJWoQiQIAAAQIECBAgQIAAAYPVDxAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIGCw+gECBAgQIECAAAECBAgQSAoYrMlahCJAgAABAgQIECBAgAABg9UPECBAgAABAgQIECBAgEBSwGBN1iIUAQIECBAgQIAAAQIECBisfoAAAQIECBAgQIAAAQIEkgIGa7IWoQgQIECAAAECBAgQIEDAYPUDBAgQIECAAAECBAgQIJAUMFiTtQhFgAABAgQIECBAgAABAgarHyBAgAABAgQIECBAgACBpIDBmqxFKAIECBAgQIAAAQIECBAwWP0AAQIECBAgQIAAAQIECCQFDNZkLUIRIECAAAECBAgQIECAgMHqBwgQIECAAAECBAgQIEAgKWCwJmsRigABAgQIECBAgAABAgQMVj9AgAABAgQIECBAgAABAkkBgzVZi1AECBAgQIAAAQIECBAgYLD6AQIECBAgQIAAAQIECBBIChisyVqEIkCAAAECBAgQIECAAAGD1Q8QIECAAAECBAgQIECAQFLAYE3WIhQBAgQIECBAgAABAgQIGKx+gAABAgQIECBAgAABAgSSAgZrshahCBAgQIAAAQIECBAgQMBg9QMECBAgQIAAAQIECBAgkBQwWJO1CEWAAAECBAgQIECAAAECBqsfIECAAAECBAgQIECAAIGkgMGarEUoAgQIECBAgAABAgQIEDBY/QABAgQIECBAgAABAgQIJAUM1mQtQhEgQIAAAQIECBAgQICAweoHCBAgQIAAAQIECBAgQCApYLAmaxGKAAECBAgQIECAAAECBAxWP0CAAAECBAgQIECAAAECSQGDNVmLUAQIECBAgAABAgQIECBgsPoBAgQIECBAgAABAgQIEEgKGKzJWoQiQIAAAQIECBAgQIAAAYPVDxAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIGCw+gECBAgQIECAAAECBAgQSAoYrMlahCJAgAABAgQIECBAgAABg9UPECBAgAABAgQIECBAgEBSwGBN1iIUAQIECBAgQIAAAQIECBisfoAAAQIECBAgQIAAAQIEkgIGa7IWoQgQIECAAAECBAgQIEDAYPUDBAgQIECAAAECBAgQIJAUMFiTtQhFgAABAgQIECBAgAABAgarHyBAgAABAgQIECBAgACBpIDBmqxFKAIECBAgQIAAAQIECBAwWP0AAQIECBAgQIAAAQIECCQFDNZkLUIRIECAAAECBAgQIECAgMHqBwgQIECAAAECBAgQIEAgKWCwJmsRigABAgQIECBAgAABAgQMVj9AgAABAgQIECBAgAABAkkBgzVZi1AECBAgQIAAAQIECBAgYLD6AQIECBAgQIAAAQIECBBIChisyVqEIkCAAAECBAgQIECAAAGD1Q8QIECAAAECBAgQIECAQFLAYE3WIhQBAgQIECBAgAABAgQIGKx+gAABAgQIECBAgAABAgSSAgZrshahCBAgQIAAAQIECBAgQMBg9QMECBAgQIAAAQIECBAgkBQwWJO1CEWAAAECBAgQIECAAAECBqsfIECAAAECBAgQIECAAIGkgMGarEUoAgQIECBAgAABAgQIEDBY/QABAgQIECBAgAABAgQIJAUM1mQtQhEgQIAAAQIECBAgQICAweoHCBAgQIAAAQIECBAgQCApYLAmaxGKAAECBAgQIECAAAECBAxWP0CAAAECBAgQIECAAAECSQGDNVmLUAQIECBAgAABAgQIECBgsPoBAgQIECBAgAABAgQIEEgKGKzJWoQiQIAAAQIECBAgQIAAAYPVDxAgQIAAAQIECBAgQIBAUsBgTdYiFAECBAgQIECAAAECBAgYrH6AAAECBAgQIECAAAECBJICBmuyFqEIECBAgAABAgQIECBAwGD1AwQIECBAgAABAgQIECCQFDBYk7UIRYAAAQIECBAgQIAAAQIGqx8gQIAAAQIECBAgQIAAgaSAwZqsRSgCBAgQIECAAAECBAgQMFj9AAECBAgQIECAAAECBAgkBQzWZC1CESBAgAABAgQIECBAgIDB6gcIECBAgAABAgQIECBAIClgsCZrEYoAAQIECBAgQIAAAQIEDFY/QIAAAQIECBAgQIAAAQJJAYM1WYtQBAgQIECAAAECBAgQIPCOZgGR1QILwAAAAABJRU5ErkJggg=='
    const btnsign = document.getElementById('btnsign');
    const companyname =  document.getElementById('CompanyName');
    const ProjectName =  document.getElementById('ProjectName');
    if(companyname.value === ''){
        message.error('Please input your Username!'),
        companyname.focus();
    }else if (ProjectName.value === ''){
      message.error('Please input your ProjectName!'),
      ProjectName.focus();
    }else if (isSignature === '' || isSignature === imagenull){
      message.error('กรุณาเซ็นชื่อ !'),
      btnsign.focus();
    }else{
      setCurrent(currentPage + 1);
    }
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
            {/* ไอคอนคอมบน button required tooltip="This is a required field" */}
              <Form form={form1} layout="vertical">
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={8}>
                    <Form.Item label="Company Name">
                      <Input placeholder="Company Name" onChange={(e)=>{handleComNameChang(e.target.value)}} value={comName} allowClear id="CompanyName" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item label="Project Name">
                      <Input placeholder="Project Name" onChange={(e)=>{handleProNameChang(e.target.value)}} value={proName} allowClear id="ProjectName" />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={8}>
                    <Form.Item label="Date">
                      <DatePicker style={{ width: '100%' }} onChange={handleDateChang} defaultValue={moment(doc_date, 'YYYY/MM/DD')} />
                    </Form.Item>
                  </Col>
                </Row>
                <Row >
                <Col className="gutter-row" span={24}>
                    <Form.Item label="รายละเอียดของงาน">
                      <TextArea
                        rows={6}
                        value={ workDetail }
                        onChange={(e)=>{setWorkDetail(e.target.value)}}
                        placeholder="รายละเอียดของงาน"
                      />
                  </Form.Item>
                </Col>
                {/* <Col className="gutter-row" span={24}>
                    <Form.Item label="รายละเอียดของงาน" required tooltip="This is a required field">
                      <CKEditor
                          editor={ ClassicEditor }
                          data={workDetail}
                          onReady={ editor => {
                              // You can store the "editor" and use when it is needed.
                              // console.log( 'Editor is ready to use!', editor );
                          } }
                          onChange={ ( event: any, editor: any ) => {
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
                  </Col> */}
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item label="รายละเอียดของงาน">
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
                    <Form.Item>
                      <TextArea
                        value= { etcDetail }
                        onChange={(e)=>{setEtcDetail(e.target.value)}}
                        placeholder="อธิบายลักษณะระบบเพิ่มเติม"
                        rows={6}
                      />
                      {/* <CKEditor
                            editor={ ClassicEditor }
                            data={etcDetail}
                            onReady={ editor => {
                                // You can store the "editor" and use when it is needed.
                                // console.log( 'Editor is ready to use!', editor );
                            } }
                            onChange={ ( event: any, editor: any ) => {
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
                        /> */}
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label="วันที่ดำเนินการ">
                      <DatePicker style={{ width: '100%' }} onChange={handleDateStartChang} defaultValue={moment(dateStart, 'YYYY/MM/DD')}  />
                    </Form.Item>
                  </Col>
                  <Col className="gutter-row" span={12}>
                    <Form.Item label="จำนวนคนที่ใช้ (คน)">
                      <Input placeholder="Number of People" onChange={(e)=>{handleNumOfpeopleChang(e.target.value)}} value={numOfpeople} allowClear />
                    </Form.Item>
                  </Col>
                </Row>
                <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col className="gutter-row" span={24}>
                    <Form.Item label="หมายเหตุ">
                      <TextArea
                        value={ notes }
                        onChange={(e)=>{setNote(e.target.value)}}
                        placeholder="หมายเหตุ"
                        rows={6}
                      />
                      {/* <CKEditor
                          editor={ ClassicEditor }
                          data={note}
                          onReady={ editor => {
                              // You can store the "editor" and use when it is needed.
                              // console.log( 'Editor is ready to use!', editor );
                          } }
                          onChange={ ( event: any, editor: any ) => {
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
                        /> */}
                    </Form.Item>
                  </Col>
                </Row>
              </Form>
              <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                <Col className="gutter-row" span={14}>
                  <Form.Item label="ลงชื่อผู้ดำเนินการ">
                    <Button type="primary" onClick={() => showCasVasInModal()}>
                      เซ็นชื่อ
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
                <SignatureCanvas
                    penColor='black'
                    onEnd={() => { endSignager(); }}
                    canvasProps={{width: 470, height: 200, className: 'sigCanvas'}}
                    ref={(ref: any) => { sigPad = ref }}
                    backgroundColor = {'#f0f2f5'}
                    />
                {/* <canvas
                    onMouseDown={startDrawing}
                    onMouseUp={finishDrawing}
                    onMouseMove={draw}
                    ref={canvasRef}
                    /> */}
                    <br>
                    </br>
                    <Button type="primary" onClick={() => clearSignatuer()}>
                      Clear
                    </Button>
                    <Input placeholder="ลงชื่อ" id="nameinmodel" onChange={(e)=>{handleNameSignature(e.target.value)}} value={nameSignature} allowClear />
                    <Select
                      showSearch
                      style={{ width: '100%' }}
                      placeholder="เลือกตำแหน่ง"
                      optionFilterProp="children"
                      defaultValue={position}
                      onChange={handlePosition}
                      id = "selectPosition"
                    >
                      {posiotionsArray.map((option) => (
                        <Option  value={option.position_name_en}>{option.position_name_en}{' '}
                        </Option>
                      ))}
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
                  <Form form={form2} layout="vertical">
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
                            id="productcode"
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
        {/* {currentPage + 1 === 3 && <div id="stepForm3">3</div>} */}
      </div>

      <Divider />

      <div className="steps-action" style={{ textAlign: 'center' }}>
        {currentPage < steps.length - 1 && (
          <Button type="primary" onClick={() => next()} disabled={checkbutton} id='btnsign'>
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
