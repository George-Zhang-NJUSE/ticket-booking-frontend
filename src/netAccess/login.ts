import axios from 'axios';
import { rootUrl } from './constant';
import { Role } from '../model/models';
import { getJWTPayload } from '../util/JWTUtil';

export const login = (key: string, password: string, role: Role) => axios.post(
    rootUrl + '/login',
    { key, password, role }
).then(res => {
    const auth: string = res.headers.Authorization;
    return getJWTPayload(auth);
});