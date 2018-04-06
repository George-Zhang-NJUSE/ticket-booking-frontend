import axios from 'axios';
import { VenueSeatType } from '../model/models';

export const addNewVenueSeatType = (newVenueSeatType: Partial<VenueSeatType>) => axios.post<VenueSeatType>(
  '/venueSeatType',
  newVenueSeatType
).then(res => res.data);

export const modifyVenueSeatType = (modifiedVenueSeatType: VenueSeatType) => axios.put<VenueSeatType>(
  '/venueSeatType',
  modifiedVenueSeatType
).then(res => res.data);

export const deleteVenueSeatType = (venueSeatTypeId: number) => axios.delete(
  '/venueSeatType',
  { params: { venueSeatTypeId } }
).then(res => res.data as void);