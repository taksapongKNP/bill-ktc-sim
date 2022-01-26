import React, { useState, useEffect } from 'react';
import { HeartTwoTone, SmileTwoTone, UploadOutlined } from '@ant-design/icons';
import {
  Card,
  Typography,
  Alert,
  Table,
  Radio,
  Divider,
  Button,
  Row,
  Col,
  Modal,
  Form,
  Input,
  Select,
  InputNumber,
  Upload,
  message,
  Tag
} from 'antd';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import { useIntl } from 'umi';
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import {
  getProducts,
  getProductById,
  updateProductById,
  addProduct,
  deleteProduct,
  getimportFileProduct,
} from '@/services/backend/api';
import { text } from 'express';
import readXlsxFile from 'read-excel-file'
import reqwest from 'reqwest';
import { await } from '@umijs/deps/compiled/signale';

type LayoutType = Parameters<typeof Form>[0]['layout'];
const { Option } = Select;

export default (): React.ReactNode => {
  const [form] = Form.useForm();
  const intl = useIntl();
  const [dataProducts, setDataProducts] = useState<API.ProductsItem[]>([]);
  const [isModalVisible1, setIsModalVisible1] = useState(false);
  const [isModalVisible2, setIsModalVisible2] = useState(false);
  const [disbledButton, setDisbledButton] = useState(true);
  const [productId, setProductId] = useState('');
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productQuantity, setProductQuantity] = useState('');
  const [productStatus, setProductStatus] = useState('');
  const [deleteId, setDeleteId] = useState([]);
  const [filesList, setFilesList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [formLayout, setFormLayout] = useState<LayoutType>('horizontal');

  const onFormLayoutChange = ({ layout }: { layout: LayoutType }) => {
    setFormLayout(layout);
  };


  const formItemLayout =
    formLayout === 'horizontal'
      ? {
          labelCol: { span: 4 },
          wrapperCol: { span: 14 },
        }
      : null;

  const buttonItemLayout =
    formLayout === 'horizontal'
      ? {
          wrapperCol: { span: 14, offset: 4 },
        }
      : null;

  const showEditModal = async (id: string) => {
    const result = await getProductById(id);
    if (result) {
      setProductId(result[0].id);
      setProductName(result[0].product_name);
      setProductPrice(result[0].product_price);
      setProductQuantity(result[0].product_num);
      setProductStatus(result[0].product_status);
      setIsModalVisible1(true);
    }
  };

  const showAddModal = async () => {
    setIsModalVisible2(true);
  };

  const handleUpdateProduct = async () => {
    const data = {
      id: productId,
      product_name: productName,
      product_price: productPrice,
      product_status: productStatus,
      product_num: productQuantity,
    };
    const update = await updateProductById(data);
    if (update) {
      refeshTable();
      setIsModalVisible1(false);
    }
  };

  const deleteProductClick = async () => {
    const data = {
      data: deleteId,
    };
    const statusDelete = await deleteProduct(data);
    if (statusDelete) {
      refeshTable();
      setDisbledButton(true);
    }
  };

  const handleAddProduct = async () => {
    console.log("add product");
    const data = {
      product_name: productName,
      product_price: productPrice,
      product_status: productStatus,
      product_num: productQuantity,
    };
    const status = await addProduct(data);
    if (status) {
      console.log(status);
      refeshTable();
      setIsModalVisible2(false);
    }
  };

  const clearState = () => {
    setProductId('');
    setProductName('');
    setProductPrice('');
    setProductStatus('');
    setProductQuantity('');
    // console.log(productId)
    // console.log(productName)
    // console.log(productId)
    // console.log(productId)
  };

  const refeshTable = async () => {
    const result = await getProducts();
    const data = result.map(
      (x: {
        id: any;
        product_code: any;
        product_name: any;
        product_status: any;
        product_price: any;
        updatedAt: any;
      }) => {
        const mapData = {
          id: x.id,
          product_code: x.product_code,
          product_name: x.product_name,
          product_status: x.product_status,
          product_price: x.product_price,
          updatedAt: x.updatedAt,
        };
        return mapData;
      },
    );
    setDataProducts(data);
    clearState();
  };

  const handleCancelUpdate = () => {
    setIsModalVisible1(false);
    clearState();
  };

  const handleCancelAdd = () => {
    clearState();
    setIsModalVisible2(false);
  };

  const columns = [
    {
      title: 'Product Code',
      dataIndex: 'product_code',
    },
    {
      title: 'Product Name',
      dataIndex: 'product_name',
    },
    {
      title: 'Product Status',
      dataIndex: 'product_status',
      render: (product_status: any) => ( checkStatus(product_status)),
    },
    {
      title: 'Price',
      dataIndex: 'product_price',
    },
    {
      title: 'Last Update',
      dataIndex: 'updatedAt',
    },
    {
      title: 'Action',
      dataIndex: 'id',
      render: (text: string) => (
        <a href="#" onClick={() => showEditModal(text)}>
          Edit
        </a>
      ),
    },
  ];

  const checkStatus =(product_status: string)=>{
    if(product_status === "Active"){
      return <Tag color="green">{product_status}</Tag>
    }else{
      return <Tag color='red'>{product_status}</Tag>
    }
  }

  const rowSelection = {
    onChange: (selectedRowKeys: React.Key[], selectedRows: API.ProductsItem[]) => {
      if (selectedRowKeys.length == 0) {
        setDisbledButton(true);
      } else {
        setDisbledButton(false);
        setDeleteId(selectedRowKeys);
      }
    },
    getCheckboxProps: (record: API.ProductsItem) => ({
      // disabled: record.name === 'Disabled User', // Column configuration not to be checked
      name: record.product_name,
    }),
  };

  useEffect(() => {
    (async function fetchdata() {
      const result = await getProducts();
      const data = result.map(
        (x: {
          id: any;
          product_code: any;
          product_name: any;
          product_status: any;
          product_price: any;
          updatedAt: any;
        }) => {
          const mapData = {
            id: x.id,
            product_code: x.product_code,
            product_name: x.product_name,
            product_status: x.product_status,
            product_price: x.product_price,
            updatedAt: x.updatedAt,
          };
          return mapData;
        },
      );
      setDataProducts(data);
    })();
  }, []);

  function confirmDelete() {
    Modal.confirm({
      title: 'Are you sure delete this product?',
      icon: <ExclamationCircleOutlined />,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        deleteProductClick();
      },
    });
  }



  const startUpload = async () => {
     await readXlsxFile(filesList).then((rows) => {
        const nameArray = [];
        for (var i = 0; i < rows.length; i++) {
          nameArray.push( JSON.stringify({ product_name : rows[i][0],product_price : rows[i][1],product_status : rows[i][2],product_num : rows[i][3],product_unit : rows[i][4]}));
        }
        const myArr = nameArray.join(',');
        const dataProduct = ('['+myArr+']');
        const dataobj = JSON.parse(dataProduct);
        setFilesList(dataobj);
        setUploading(true);

        reqwest({
          data : getimportFileProduct(dataobj),
          processData: false,
          success: async () => {
            setFilesList([]);
            setUploading(false);
            await refeshTable();
            // await message.success('upload successfully.');
            window.location.reload();
          },
          error: () => {
            setUploading(false);
            message.error('upload failed.');
          },
        })
      });
  }
  const propsUpload = {
    onRemove: async () => {
      const index = setFilesList([]);
      const newFileList = index;
      return {
        filesList: newFileList,
      };
    },
    beforeUpload: async (file) => {
      const index = {filesList : file }
      setFilesList(index.filesList)
      return false;
    },
    // filesList: setFilesList([]),
  };

  return (
    <>
      <PageHeaderWrapper>
        <Card>
          <Typography.Title level={2} style={{ textAlign: 'center' }}>
            <div>
              <Divider />
              <Row justify="end" style={{ marginBottom: '0.5rem' }}>
                <Col span={4}>
                  <Button type="primary" onClick={showAddModal}>
                    Add
                  </Button>{' '}
                  <Button danger disabled={disbledButton} onClick={confirmDelete}>
                    Delete
                  </Button>{' '}
                <Upload {...propsUpload}>
                  <Button  icon={<UploadOutlined />} id="inputUpload" >Import</Button>
                </Upload>
                </Col>
                <Col span={1.5}>
                  <Button
                      type="primary"
                      onClick={startUpload}
                      disabled={filesList.length === 0}
                      loading={uploading}
                      // style={{ marginTop: 16 }}
                    >
                    {uploading ? 'Uploading' : 'Start Upload'}
                  </Button>
                </Col>
              </Row>
              <Table
                rowSelection={{
                  type: 'checkbox',
                  ...rowSelection,
                }}
                rowKey="id"
                columns={columns}
                dataSource={dataProducts}
              />
            </div>
          </Typography.Title>
        </Card>
      </PageHeaderWrapper>
      <Modal
        title="Edit Product"
        visible={isModalVisible1}
        onOk={handleUpdateProduct}
        onCancel={handleCancelUpdate}
      >
        {/* <h5>{productName}</h5> */}
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          onValuesChange={onFormLayoutChange}
        >
          <Form.Item label="Name">
            <Input
              placeholder="Product Name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
            />
          </Form.Item>
          <Form.Item label="Price">
            <InputNumber min={0} value={productPrice} onChange={(e) => setProductPrice(e)} />
          </Form.Item>
          <Form.Item label="Quantity">
            <InputNumber min={0} value={productQuantity} onChange={(e) => setProductQuantity(e)} />
          </Form.Item>
          <Form.Item label="Status">
            <Select value={productStatus} onChange={(e) => setProductStatus(e)}>
              <Option value="Active" selected>
                Active
              </Option>
              <Option value="Not Active">Not Active</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Add Product"
        visible={isModalVisible2}
        onOk={handleAddProduct}
        onCancel={handleCancelAdd}
      >
        <Form
          {...formItemLayout}
          layout={formLayout}
          form={form}
          initialValues={{ layout: formLayout }}
          onValuesChange={onFormLayoutChange}
          id="addForm"
        >
          <Form.Item label="Name">
            <Input onChange={(e) => setProductName(e.target.value)} />
          </Form.Item>
          <Form.Item label="Price">
            <InputNumber min={0} onChange={(e) => setProductPrice(e)} />
          </Form.Item>
          <Form.Item label="Quantity">
            <InputNumber min={0} onChange={(e) => setProductQuantity(e)} />
          </Form.Item>
          <Form.Item label="Status">
            <Select onChange={(e) => setProductStatus(e)}>
              <Option value="Active" selected>
                Active
              </Option>
              <Option value="Not Active">Not Active</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};
