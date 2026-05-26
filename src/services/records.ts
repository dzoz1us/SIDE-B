import api from './api';
import { RecordShort, RecordDetail } from '../types';

export const getRecords = async (): Promise<RecordShort[]> => {
  const { data } = await api.get('/records/');
  return data.results;
};

export const getRecord = async (id: number): Promise<RecordDetail> => {
  const { data } = await api.get(`/records/${id}/`);
  return data;
};

export const getTopSellers = async (): Promise<RecordShort[]> => {
  const { data } = await api.get('/records/top_sellers/');
  return data;
};