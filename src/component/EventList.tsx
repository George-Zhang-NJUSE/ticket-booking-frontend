import * as React from 'react';
import { EventListProps, eventListInjector } from '../store/stores';
import { observer, inject } from 'mobx-react';

@inject(eventListInjector)
@observer
export class EventList extends React.Component<EventListProps> {

    render() {
        return (
            null
        );
    }
}