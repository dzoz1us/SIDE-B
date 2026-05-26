import axios from 'axios';
import api from './api';
import { User } from '../types';

const API_URL = 'http://127.0.0.1:8000/api/v1';

interface RegisterResponse {
  user: User;
  access: string;
  refresh: string;
}

export const login = async (email: string, password: string): Promise<User> => {
  // Напрямую запрашиваем токен, минуя перехватчики api
  const { data } = await axios.post(`${API_URL}/auth/login/`, { email, password });
  
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);

  // Явно передаём токен в заголовке
  const profileRes = await axios.get(`${API_URL}/auth/profile/`, {
    headers: { Authorization: `Bearer ${data.access}` }
  });
  return profileRes.data;
};

export const register = async (email: string, password: string, firstName: string, lastName: string): Promise<User> => {
  const { data } = await axios.post<RegisterResponse>(`${API_URL}/auth/register/`, {
    email,
    password,
    first_name: firstName,
    last_name: lastName,
  });
  localStorage.setItem('access_token', data.access);
  localStorage.setItem('refresh_token', data.refresh);
  return data.user;
};

export const logout = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
};

export const getProfile = async (): Promise<User> => {
  const { data } = await api.get('/auth/profile/');
  return data;
};