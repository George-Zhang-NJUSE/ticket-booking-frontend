import axios from 'axios';
import { Summary } from '../model/models';

export const getUnhandledSummaryList = () => axios.get<Summary[]>(
  '/summary'
).then(res => res.data);

export const handleSummary = (summaryId: number) => axios.put<void>(
  '/summary',
  undefined,
  { params: { summaryId } }
);