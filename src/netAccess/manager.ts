import axios from 'axios';
import { Manager } from '../model/models';

export const getManager = (managerId: number) => axios.get<Manager>(
  '/manager',
  { params: { managerId } }
).then(res => res.data);