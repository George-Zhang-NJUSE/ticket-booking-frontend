import axios from 'axios';
import { rootUrl } from './constant';
import { EventSeatPrice } from '../model/models';

export const addEventSeatPrice = (newEventSeatPrice: Partial<EventSeatPrice>) => axios.post<EventSeatPrice>(
    rootUrl + '/eventSeatPrice',
    newEventSeatPrice
).then(res => res.data);

export const deleteEventSeatPrice = (eventSeatPriceId: number) => axios.delete(
    rootUrl + '/eventSeatPrice',
    { params: { eventSeatPriceId } }
).then(res => res.data as void);

export const modifyEventSeatPrice = (modifiedEventSeatPrice: EventSeatPrice) => axios.put<EventSeatPrice>(
    rootUrl + '/eventSeatPrice',
    modifiedEventSeatPrice
).then(res => res.data);

export const getEventSeatPriceList = (eventId: number) => axios.get<EventSeatPrice[]>(
    rootUrl + '/eventSeatPrice',
    { params: { eventId } }
).then(res => res.data);