import axios from 'axios';
import { Event, EventFilter } from '../model/models';

export const getEvent = (eventId: number) => axios.get<Event>(
    '/event',
    { params: { eventId } }
).then(res => res.data);

export const getEventList = (filter: EventFilter) => axios.post<Event[]>(
    '/event/list',
    filter
).then(res => res.data);

export const addNewEvent = (newEvent: Partial<Event>) => axios.post<Event>(
    '/event',
    newEvent
).then(res => res.data);

export const modifyEvent = (modifiedEvent: Event) => axios.put<Event>(
    '/event',
    modifiedEvent
).then(res => res.data);