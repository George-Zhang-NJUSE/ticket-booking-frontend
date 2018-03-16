import axios from 'axios';
import { rootUrl } from './constant';
import { Order } from '../model/models';

export const getOrderList = (userId: number) => axios.get<Order[]>(
    rootUrl + '/order',
    { params: { userId } }
).then(res => res.data);

export const addNewOrder = (newOrder: Partial<Order>) => axios.post<Order>(
    rootUrl + '/order',
    newOrder
).then(res => res.data);

export const payOrder = (orderId: number) => axios.put<boolean>(
    rootUrl + '/order/pay',
    undefined,
    { params: { orderId } }
).then(res => res.data);

export const cancelOrder = (orderId: number) => axios.put<void>(
    rootUrl + '/order/cancel',
    undefined,
    { params: { orderId } }
).then(res => res.data);