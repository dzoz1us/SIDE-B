import api from './api';
import { EnsembleShort, EnsembleDetail } from '../types';

export const getEnsembles = async (): Promise<EnsembleShort[]> => {
  const { data } = await api.get('/ensembles/');
  return data.results;
};

export const getEnsemble = async (id: number): Promise<EnsembleDetail> => {
  const { data } = await api.get(`/ensembles/${id}/`);
  return data;
};