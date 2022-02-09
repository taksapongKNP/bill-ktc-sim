// @ts-ignore
/* eslint-disable */
import { request } from 'umi';

const urlBackend = `http://localhost:3000`;

export async function currentUser(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<API.CurrentUser>(`${urlBackend}/api/users/profile`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(options || {}),
  });
}

export async function getProductAll(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(options || {}),
  });
}

export async function getProductByProCode(id: string) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products/procode/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function outLogin(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
    },
    ...(options || {}),
  });
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  return request<API.LoginResult>(`${urlBackend}/api/users/login`, {
    method: 'POST',
    data: body,
    ...(options || {}),
  });
}

export async function getNotices(options?: { [key: string]: any }) {
  return request<API.NoticeIconList>('/api/notices', {
    method: 'GET',
    ...(options || {}),
  });
}

export async function rule(
  params: {
    // query
    /** 当前的页码 */
    current?: number;
    /** 页面的容量 */
    pageSize?: number;
  },
  options?: { [key: string]: any },
) {
  return request<API.RuleList>('/api/rule', {
    method: 'GET',
    params: {
      ...params,
    },
    ...(options || {}),
  });
}

export async function updateRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'PUT',
    ...(options || {}),
  });
}

export async function addRule(options?: { [key: string]: any }) {
  return request<API.RuleListItem>('/api/rule', {
    method: 'POST',
    ...(options || {}),
  });
}

export async function removeRule(options?: { [key: string]: any }) {
  return request<Record<string, any>>('/api/rule', {
    method: 'DELETE',
    ...(options || {}),
  });
}

export async function getProducts() {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function getProductById(id: string) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateProductById(data: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products/${data.product_code}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
}

export async function addProduct(data: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
}

export async function deleteProduct(data: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
}

// export async function removeRule(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/rule', {
//     method: 'DELETE',
//     ...(options || {}),
//   });
// }

export async function getDataexport(data: { [key: string]: any }) {
  return request<any>(`${urlBackend}/api/export/create/${data}`, {
    method: 'POST',
    data: data,
    ...(data || {}),
  });
}

export async function downloadExcel(data: any) {
  return request<any>(`${urlBackend}/api/download/excel/${data}`, {
    method: 'GET',
    data: data,
    ...(data || {}),
  });
}

export async function getPositionsAll(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/positions`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(options || {}),
  });
}

export async function getFileallsurvay (id: string){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/survey`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getFillAllUser (){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/survey/Username`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getimportFileProduct(data: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products/importProduct`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
}

export async function imageInsert(data: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/surveyImages`, {
    method: 'POST',
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(data || {}),
  });
}


export async function imageInsertmultirows(data: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/surveyImages/multirows`, {
    method: 'POST',
    data: data,
    headers: {
      Authorization: `Bearer ${token}`,
    },
    ...(data || {}),
  });
}

export async function getdataDetaillist (id: any){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/surveyDetails/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getdataDetail (id: any){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/survey/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function getImagedetail(id: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/surveyImages/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateDatasurvey(data: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/survey/${data.detailsurvey_code}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
}

export async function productDatatale(id: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/products/joinproduct/${id}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function updateDetailsurvey(data: any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/surveyDetails/${data.survey_code}`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
    },
    data: data,
  });
}


//Statement
export async function getdataBilling (){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/statement`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function downloadPdfBilling(data: any) {
  return request<any>(`${urlBackend}/api/billing/statement/pdf/${data}`, {
    method: 'GET',
    data: data,
    ...(data || {}),
  });
}

export async function getdataBillingByDate (data: any){
  return request<any>(`${urlBackend}/api/billing/statement/findByDate/${data}`, {
    method: 'POST',
    data: data,
    ...(data || {}),
  })
}

// export async function exportPdfByDate (data: any){
//   return request<any>(`${urlBackend}/api/billing/statement/pdfByDate/${data}`, {
//     method: 'GET',
//     data: data,
//     ...(data || {}),
//   })
// }

export async function exportZipByDate (data: any){
  return request<any>(`${urlBackend}/api/billing/statement/zipByDate/${data}`, {
    method: 'GET',
    data: data,
    ...(data || {}),
  })
}
//Invoice

export async function getdataInvoiceByDate (data: any){
  return request<any>(`${urlBackend}/api/billing/invoice/findByDate/${data}`, {
    method: 'POST',
    data: data,
    ...(data || {}),
  })
}

export async function exportZipInvoiceByDate (data: any){
  return request<any>(`${urlBackend}/api/billing/invoice/zipByDate/${data}`, {
    method: 'GET',
    data: data,
    ...(data || {}),
  })
}
