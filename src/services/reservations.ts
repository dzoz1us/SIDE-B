import api from './api';
import { Reservation } from '../types';

export const createReservation = async (recordId: number, branchId: number) => {
  const { data } = await api.post('/reservations/', {
    record: recordId,
    branch: branchId,
  });
  return data;
};

export const getMyReservations = async (): Promise<Reservation[]> => {
  const { data } = await api.get('/reservations/my/');
  return data.results || data;
};

export const cancelReservation = async (id: number) => {
  const { data } = await api.post(`/reservations/${id}/cancel/`);
  return data;
};