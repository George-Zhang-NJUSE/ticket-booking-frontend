import axios from 'axios';
import { rootUrl } from './constant';
import { VenueSeatType } from '../model/models';

export const addNewVenueSeatType = (newVenueSeatType: Partial<VenueSeatType>) => axios.post<VenueSeatType>(
    rootUrl + '/venueSeatType',
    newVenueSeatType
).then(res => res.data);

export const modifyVenueSeatType = (modifiedVenueSeatType: VenueSeatType) => axios.put<VenueSeatType>(
    rootUrl + '/venueSeatType',
    modifiedVenueSeatType
).then(res => res.data);

export const deleteVenueSeatType = (venueSeatTypeId: number) => axios.delete(
    rootUrl + '/venueSeatType',
    { params: { venueSeatTypeId } }
).then(res => res.data as void);