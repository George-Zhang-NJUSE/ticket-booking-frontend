import axios, { AxiosResponse } from 'axios';
import { message } from 'antd';
import { stores } from '../store/stores';
import { history } from '../component/App';

axios.defaults.baseURL = 'http://localhost:8080';

axios.interceptors.response.use(undefined, (error) => {
  console.error(error);
  if (error.response) {
    const response = error.response as AxiosResponse;
    if (response.status === 403) {
      message.error('未登录或登录已过期，将跳转至登录界面。');
      stores.currentAccount.logout();
      // 界面跳转
      history && history.push('/login');
    } else {
      message.error('网络请求出错！');
    }
  } else if (error.request) {
    message.error('未接收到服务器回应，请检查您的网络连接。');
    console.error(error.request);
  } else {
    message.error('建立网络请求时出错。');
  }
  throw error;
});

const token = localStorage.getItem('token');
if (token) {
  setAuthHeader(token);
}

export function setAuthHeader(authToken: string) {
  if (!authToken) {
    delete axios.defaults.headers.common['Authorization'];
    return;
  }
  axios.defaults.headers.common['Authorization'] = authToken;
}