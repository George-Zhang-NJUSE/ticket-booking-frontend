import { configure } from 'mobx';
import { IncomingEventList } from './eventList';

configure({ enforceActions: true });

type ProviderProps = {
    stores: AllStores
};

type AllStores = {
    incomingEventList: IncomingEventList
};

export const stores: AllStores = {
    incomingEventList: new IncomingEventList()
};

export type EventListProps = {
    eventList?: IncomingEventList;
};

export const eventListInjector = (props: ProviderProps): EventListProps => ({
    eventList: props.stores.incomingEventList
});