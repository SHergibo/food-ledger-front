import axios from 'axios';
import { apiDomain } from './../apiConfig/ApiConfig';


const axiosInstance = axios.create({
  baseURL: apiDomain,
  timeout: 5000,
  headers: {
    ContentType: 'applications/json',
    Accept: 'application/json',
  }
});

axiosInstance.interceptors.request.use(
  config => {
    config.headers.Authorization = `Bearer ${localStorage.getItem('access_token')}`;
    return config;
  },
  error => {
    return Promise.reject(error);
    }
);

export default axiosInstance;