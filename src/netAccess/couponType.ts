import axios from 'axios';
import { CouponType } from '../model/models';

export const getCouponTypeList = (activatedOnly: boolean) => axios.get<CouponType[]>(
    '/couponType',
    { params: { activatedOnly } }
).then(res => res.data);

export const addNewCouponType = (newCouponType: Partial<CouponType>) => axios.post<CouponType>(
    '/couponType',
    newCouponType
).then(res => res.data);

export const modifyCouponType = (modifiedCouponType: CouponType) => axios.put<CouponType>(
    '/couponType',
    modifiedCouponType
).then(res => res.data);

export const setCouponTypeActivated = (couponTypeId: number, isActivated: boolean) => axios.put<boolean>(
    '/couponType/activate',
    undefined,
    { params: { couponTypeId, isActivated } }
).then(res => res.data);