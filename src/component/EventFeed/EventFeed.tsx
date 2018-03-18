import * as React from 'react';
import { EventFilter } from './EventFilter';
import { EventList } from './EventList';
import { LoadMore } from './LoadMore';

export function EventFeed() {
    return (
        <div>
            <EventFilter />
            <EventList />
            <LoadMore />
        </div>
    );
}