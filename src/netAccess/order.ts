import axios from 'axios';
import { Order } from '../model/models';

export const getUserOrderList = (userId: number) => axios.get<Order[]>(
  '/order',
  { params: { userId } }
).then(res => res.data);

export const addNewOrder = (newOrder: Partial<Order>) => axios.post<Order>(
  '/order',
  newOrder
).then(res => res.data);

export const payOrder = (orderId: number) => axios.put<boolean>(
  '/order/pay',
  undefined,
  { params: { orderId } }
).then(res => res.data);

export const cancelOrder = (orderId: number) => axios.put<void>(
  '/order/cancel',
  undefined,
  { params: { orderId } }
).then(res => res.data);

export const getVenueOrderList = (venueId: number) => axios.get<Order[]>(
  '/order/venue',
  { params: { venueId } }
).then(res => res.data);