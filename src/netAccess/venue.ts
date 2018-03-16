import axios from 'axios';
import { rootUrl } from './constant';
import { Venue } from '../model/models';

export const applyForNewVenue = (newVenue: Partial<Venue>) => axios.post<Venue>(
    rootUrl + '/venue',
    newVenue
).then(res => res.data);

export const getVenue = (venueId: number) => axios.get<Venue>(
    rootUrl + '/venue',
    { params: { venueId } }
).then(res => res.data);

export const setVenueApplicationApproved = (venueId: number, isApproved: boolean) => axios.put<boolean>(
    rootUrl + '/venue/approved',
    undefined,
    { params: { venueId, isApproved } }
).then(res => res.data);