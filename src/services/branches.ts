import api from './api';
import { Branch } from '../types';

export const getBranches = async (): Promise<Branch[]> => {
  const { data } = await api.get('/branches/');
  return data.results;
};