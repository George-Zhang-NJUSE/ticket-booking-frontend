import axios from 'axios';
import { rootUrl } from './constant';
import { Event, EventFilter } from '../model/models';

export const getEvent = (eventId: number) => axios.get<Event>(
    rootUrl + '/event',
    { params: { eventId } }
).then(res => res.data);

export const getEventList = (filter: EventFilter) => axios.post<Event[]>(
    rootUrl + '/event/list',
    filter
).then(res => res.data);

export const addNewEvent = (newEvent: Partial<Event>) => axios.post<Event>(
    rootUrl + '/event',
    newEvent
).then(res => res.data);

export const modifyEvent = (modifiedEvent: Event) => axios.put<Event>(
    rootUrl + '/event',
    modifiedEvent
).then(res => res.data);