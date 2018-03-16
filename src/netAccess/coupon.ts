import axios from 'axios';
import { rootUrl } from './constant';
import { Coupon } from '../model/models';

export const acquireCoupon = (userId: number, couponTypeId: number) => axios.post<Coupon>(
    rootUrl + '/coupon',
    undefined,
    { params: { userId, couponTypeId } }
).then(res => res.data);

export const getUserCouponList = (userId: number) => axios.get<Coupon[]>(
    rootUrl + '/coupon',
    { params: { userId } }
).then(res => res.data);