import Axios from 'axios';
import {apiDomain, apiVersion} from './../apiConfig/ApiConfig';

let response;
let authenticated = false;

const loginIn = async (data) =>{
  await Axios.post(`${apiDomain}/api/${apiVersion}/auth/login`, data)
  .then((res) =>{
    if(res.status === 200 && res.data.token.accessToken && res.data.token.expiresIn){
      response = res.status;
      let accessToken = res.data.token.accessToken;
      let refresh_token = res.data.token.refreshToken.token;
      let user_id = res.data.user._id;
      let user_email = res.data.user.email;
  
      localStorage.setItem("access_token", accessToken);
      localStorage.setItem('refresh_token', refresh_token);
      localStorage.setItem('user_id', user_id);
      localStorage.setItem('user_email', user_email);
    }
  })
  .catch(() =>{
    response = 401;
  })
  return response;
};

const logout = async(localData) =>{
  try {
    let requestUrl = "logout";
    let data = {
      access_token : localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
      user_email: localStorage.getItem('user_email')
    }
    if(localData){
      requestUrl = "logoutAndRefresh";
      data = localData;
    }

    const logout = Axios.create({
      baseURL: apiDomain,
      timeout: 15000,
      headers: {
        ContentType: 'applications/json',
        Accept: 'application/json',
        Authorization: `Bearer ${data.access_token}`
      }
    });
    
    await logout.post(`${apiDomain}/api/${apiVersion}/auth/${requestUrl}`, {
      token : data.refresh_token,
      email : data.user_email
    });

    if(!localData){
      localStorage.clear();
      sessionStorage.clear();
    }

  } catch (error) {
    console.log(error);
  }
};

const refreshToken = async() =>{
  const refreshToken = localStorage.getItem('refresh_token');
  const email = localStorage.getItem('user_email');
  if(refreshToken && email){
    const refresh = Axios.create({
      baseURL: apiDomain,
      timeout: 15000,
      headers: {
        ContentType: 'applications/json',
        Accept: 'application/json',
        Authorization: `Bearer ${localStorage.getItem('access_token')}`
      }
    });
    try {
      await refresh
      .post(`/api/${apiVersion}/auth/refresh-token`, { 
        refreshToken,
        email
      })
      .then((response) => {
        localStorage.setItem('access_token', response.data.accessToken);
        localStorage.setItem('refresh_token', response.data.refreshToken.token);
      });
      return true;
    } catch (error) {
      return false;
    }
   
  }else{
    return false;
  }

};

const isAuthenticated = async() =>{
    if(await refreshToken()){
      authenticated = true;
    }else{
      authenticated = false;
    }

  return authenticated;
};

export { loginIn, logout, isAuthenticated, refreshToken };