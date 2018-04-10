import axios from 'axios';
import { Manager, Statistics } from '../model/models';

export const getManager = (managerId: number) => axios.get<Manager>(
  '/manager',
  { params: { managerId } }
).then(res => res.data);

export const getStatistics = () => axios.get<Statistics>(
  '/manager/statistics'
).then(res => res.data);