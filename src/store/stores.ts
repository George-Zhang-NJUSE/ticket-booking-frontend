import { configure } from 'mobx';
import { MEventFeed } from './eventFeed';

configure({ enforceActions: true });

type ProviderProps = {
    stores: AllStores
};

type AllStores = {
    eventFeed: MEventFeed
};

export const stores: AllStores = {
    eventFeed: new MEventFeed()
};

export type MEventFeedProps = {
    eventFeed?: MEventFeed;
};

export const eventFeedInjector = (props: ProviderProps): MEventFeedProps => ({
    eventFeed: props.stores.eventFeed
});