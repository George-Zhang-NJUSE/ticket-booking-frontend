import axios from 'axios';
import { Venue } from '../model/models';

export const applyForNewVenue = (newVenue: Partial<Venue>) => axios.post<Venue>(
  '/venue',
  newVenue
).then(res => res.data);

export const getVenue = (venueId: number) => axios.get<Venue>(
  '/venue',
  { params: { venueId } }
).then(res => res.data);

export const setVenueApplicationApproved = (venueId: number, isApproved: boolean) => axios.put<boolean>(
  '/venue/approved',
  undefined,
  { params: { venueId, isApproved } }
).then(res => res.data);

export const getApplyingVenueList = () => axios.get<Venue[]>(
  '/venue/applying'
).then(res => res.data);