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


export async function outLogin(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<Record<string, any>>('/api/login/outLogin', {
    method: 'POST',
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
    ...(options || {}),
  });
}

export async function login(body: API.LoginParams, options?: { [key: string]: any }) {
  console.log(body)
  return request<API.LoginResult>(`${urlBackend}/api/users/login`, {
    method: 'POST',
    headers: { 
      'Content-Type': 'application/json'
    },
    data: body,
    ...(body || {}),
    
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

// export async function removeRule(options?: { [key: string]: any }) {
//   return request<Record<string, any>>('/api/rule', {
//     method: 'DELETE',
//     ...(options || {}),
//   });
// }

export async function getPositionsAll(options?: { [key: string]: any }) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/positions`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    ...(options || {}),
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
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/statement/pdf/${data}`, {
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    ...(data || {}),
  });
}

export async function getdataBillingByDate (data: any){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/statement/findByDate/${data}`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
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
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/statement/zipByDate/${data}`, {
    method: 'GET',
    headers :{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    ...(data || {}),
  })
}
//Invoice

export async function getdataInvoiceByDate (data: any){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/invoice/findByDate/${data}`, {
    method: 'POST',
    headers:{
      Authorization: `Bearer ${token}`,
    },
    data: data,
    ...(data || {}),
  })
}

export async function exportZipInvoiceByDate (data: any){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/invoice/zipByDate/${data}`, {
    method: 'GET',
    headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    ...(data || {}),
  })
}

export async function readExcelFile (data: any){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/invoice/readExcelFile`, {
    method: 'POST',
    headers:{
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    ...(data || {}),
  })
}

//Upload Log 
export async function getUploadLog (data:any){
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/uploadLog/get/${data}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
}

export async function deleteDataFormLog(data:any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/uploadLog/delete`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    ...(data || {}),
    
  });
}

export async function sendSmsFormLog(data:any) {
  const token = localStorage.getItem('token');
  return request<any>(`${urlBackend}/api/billing/uploadLog/sendSms`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    data: data,
    ...(data || {}),
    
  });
}