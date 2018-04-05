import axios from 'axios';
import { Role } from '../model/models';
import { getJWTPayload } from '../util/JWTUtil';
import { setAuthHeader } from './config';

export const getAuth = (key: string, password: string, role: Role) => axios.post(
    '/login',
    { key, password, role }
).then(res => {
    const auth: string = res.headers['authorization'];  // axios response header会被转换成小写
    if (!auth) {
        return null;
    }
    localStorage.setItem('token', auth);
    setAuthHeader(auth);
    return getJWTPayload(auth);
});

export const removeAuth = () => {
    localStorage.removeItem('token');
    setAuthHeader('');
};