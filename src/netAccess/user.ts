import axios from 'axios';
import { User } from '../model/models';

export const getUser = (userId: number) => axios.get<User>(
  '/user',
  { params: { userId } }
).then(res => res.data);

export const modifyUser = (modifiedUser: User) => axios.put<User>(
  '/user',
  modifiedUser
).then(res => res.data);

export const applyForNewUser = (newUser: Partial<User>) => axios.post<User>(
  '/user',
  newUser
).then(res => res.data);