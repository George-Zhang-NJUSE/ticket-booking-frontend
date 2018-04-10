import axios from 'axios';
import { Summary } from '../model/models';

export const getAllSummaryList = () => axios.get<Summary[]>(
  '/summary'
).then(res => res.data);

export const setSummaryHandled = (summaryId: number) => axios.put<void>(
  '/summary',
  undefined,
  { params: { summaryId } }
);