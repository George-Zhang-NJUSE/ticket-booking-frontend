import { configure } from 'mobx';
import { MEventFeed } from './eventFeed';
import { MCurrentAccount } from './currentAccount';
import { MCurrentOrder } from './currentOrder';

configure({ enforceActions: true });

type ProviderProps = {
  stores: AllStores
};

type AllStores = {
  eventFeed: MEventFeed
  currentAccount: MCurrentAccount
  currentOrder: MCurrentOrder
};

const eventFeed = new MEventFeed(),
  currentAccount = new MCurrentAccount(),
  currentOrder = new MCurrentOrder(currentAccount);

export const stores: AllStores = {
  eventFeed, currentOrder, currentAccount
};

// 以下为各种store的注入

export type MEventFeedProps = {
  eventFeed?: MEventFeed;
};

export const eventFeedInjector = (props: ProviderProps): MEventFeedProps => ({
  eventFeed: props.stores.eventFeed
});

export type MCurrentAccountProps = {
  currentAccount?: MCurrentAccount
};

export const currentAccountInjector = (props: ProviderProps): MCurrentAccountProps => ({
  currentAccount: props.stores.currentAccount
});

export type MCurrentOrderProps = {
  currentOrder?: MCurrentOrder
};

export const currentOrderInjector = (props: ProviderProps): MCurrentOrderProps => ({
  currentOrder: props.stores.currentOrder
});