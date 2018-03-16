import axios from 'axios';
import { rootUrl } from './constant';
import { User } from '../model/models';

export const getUser = (userId: number) => axios.get<User>(
    rootUrl + '/user',
    { params: { userId } }
).then(res => res.data);

export const modifyUser = (modifiedUser: User) => axios.put<User>(
    rootUrl + '/user',
    modifiedUser
).then(res => res.data);

export const applyForNewUser = (newUser: Partial<User>) => axios.post(
    rootUrl + '/user',
    newUser
).then(res => res.data);