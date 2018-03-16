import axios from 'axios';
import { rootUrl } from './constant';
import { VenueChange, VenueChangeState } from '../model/models';

export const getVenueChangeList = (
    state: VenueChangeState,
    pageSize: number,
    pageNum: number
) => axios.get<VenueChange[]>(
    rootUrl + '/venueChange',
    { params: { state, pageSize, pageNum } }
).then(res => res.data);

export const addNewVenueChange = (newVenueChange: Partial<VenueChange>) => axios.post<VenueChange>(
    rootUrl + '/venueChange',
    newVenueChange
).then(res => res.data);

export const setVenueChangeApproved = (venueChangeId: number, isApproved: boolean) => axios.put<boolean>(
    rootUrl + '/venueChange',
    undefined,
    { params: { venueChangeId, isApproved } }
).then(res => res.data);