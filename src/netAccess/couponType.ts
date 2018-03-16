import axios from 'axios';
import { rootUrl } from './constant';
import { CouponType } from '../model/models';

export const getCouponTypeList = (activatedOnly: boolean) => axios.get<CouponType[]>(
    rootUrl + '/couponType',
    { params: { activatedOnly } }
).then(res => res.data);

export const addNewCouponType = (newCouponType: Partial<CouponType>) => axios.post<CouponType>(
    rootUrl + '/couponType',
    newCouponType
).then(res => res.data);

export const modifyCouponType = (modifiedCouponType: CouponType) => axios.put<CouponType>(
    rootUrl + '/couponType',
    modifiedCouponType
).then(res => res.data);

export const setCouponTypeActivated = (couponTypeId: number, isActivated: boolean) => axios.put<boolean>(
    rootUrl + '/couponType/activate',
    undefined,
    { params: { couponTypeId, isActivated } }
).then(res => res.data);