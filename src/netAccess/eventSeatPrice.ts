import axios from 'axios';
import { EventSeatPrice } from '../model/models';

export const addEventSeatPrice = (newEventSeatPrice: Partial<EventSeatPrice>) => axios.post<EventSeatPrice>(
    '/eventSeatPrice',
    newEventSeatPrice
).then(res => res.data);

export const deleteEventSeatPrice = (eventSeatPriceId: number) => axios.delete(
    '/eventSeatPrice',
    { params: { eventSeatPriceId } }
).then(res => res.data as void);

export const modifyEventSeatPrice = (modifiedEventSeatPrice: EventSeatPrice) => axios.put<EventSeatPrice>(
    '/eventSeatPrice',
    modifiedEventSeatPrice
).then(res => res.data);

export const getEventSeatPriceList = (eventId: number) => axios.get<EventSeatPrice[]>(
    '/eventSeatPrice',
    { params: { eventId } }
).then(res => res.data);