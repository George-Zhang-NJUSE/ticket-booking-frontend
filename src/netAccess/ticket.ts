import axios from 'axios';
import { Ticket } from '../model/models';

/**
 * 用于线下非会员购票
 * 其余情况均通过Order接口购票
 */
export const addNewTicket = (newTicket: Partial<Ticket>) => axios.post<Ticket>(
  '/ticket',
  newTicket
).then(res => res.data);

export const checkTicket = (ticketId: number) => axios.put<void>(
  '/ticket/check',
  undefined,
  { params: { ticketId } }
);

export const getAvailableSeats = (eventId: number, venueSeatTypeId: number) => axios.get<number[][]>(
  '/ticket/seat',
  { params: { eventId, venueSeatTypeId } }
).then(res => res.data);

export const getEventTicketList = (eventId: number) => axios.get<Ticket[]>(
  '/ticket',
  { params: { eventId } }
).then(res => res.data);