import axios from 'axios';
import { Coupon } from '../model/models';

export const acquireCoupon = (userId: number, couponTypeId: number) => axios.post<Coupon>(
  '/coupon',
  undefined,
  { params: { userId, couponTypeId } }
).then(res => res.data);

export const getUserCouponList = (userId: number) => axios.get<Coupon[]>(
  '/coupon',
  { params: { userId } }
).then(res => res.data);