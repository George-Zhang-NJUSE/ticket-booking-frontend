import axios from 'axios';
import { rootUrl } from './constant';
import { Ticket } from '../model/models';

/**
 * 用于线下非会员购票
 * 其余情况均通过Order接口购票
 */
export const addNewTicket = (newTicket: Partial<Ticket>) => axios.post<Ticket>(
    rootUrl + '/ticket',
    newTicket
).then(res => res.data);

export const checkTicket = (ticketId: number) => axios.put<void>(
    rootUrl + '/ticket/check',
    undefined,
    { params: { ticketId } }
);

export const getAvailableSeats = (eventId: number, venueSeatTypeId: number) => axios.get<number[][]>(
    rootUrl + '/ticket/seat',
    { params: { eventId, venueSeatTypeId } }
).then(res => res.data);