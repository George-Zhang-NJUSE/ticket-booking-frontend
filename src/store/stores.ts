import { configure } from 'mobx';
import { MEventFeed } from './eventFeed';
import { MCurrentUser } from './currentUser';
import { MCurrentOrder } from './currentOrder';

configure({ enforceActions: true });

type ProviderProps = {
    stores: AllStores
};

type AllStores = {
    eventFeed: MEventFeed
    currentUser: MCurrentUser
    currentOrder: MCurrentOrder
};

const eventFeed = new MEventFeed(),
    currentUser = new MCurrentUser(),
    currentOrder = new MCurrentOrder(currentUser);

export const stores: AllStores = {
    eventFeed, currentOrder, currentUser
};

// 以下为各种store的注入

export type MEventFeedProps = {
    eventFeed?: MEventFeed;
};

export const eventFeedInjector = (props: ProviderProps): MEventFeedProps => ({
    eventFeed: props.stores.eventFeed
});

export type MCurrentUserProps = {
    currentUser?: MCurrentUser
};

export const currentUserInjector = (props: ProviderProps): MCurrentUserProps => ({
    currentUser: props.stores.currentUser
});

export type MCurrentOrderProps = {
    currentOrder?: MCurrentOrder
};

export const currentOrderInjector = (props: ProviderProps): MCurrentOrderProps => ({
    currentOrder: props.stores.currentOrder
});