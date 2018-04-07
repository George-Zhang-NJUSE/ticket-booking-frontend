import { observable, action, computed, flow } from 'mobx';
import { Ticket, Coupon, User, Event, EventSeatPrice } from '../model/models';
import { MCurrentAccount, MCurrentUser } from './currentAccount';
import { addNewOrder } from '../netAccess/order';

export class MCurrentOrder {

  @observable event: Event | null = null;

  @observable selectedPrice: EventSeatPrice | null = null;

  @observable tickets: Partial<Ticket>[] = [];

  @observable coupon: Coupon | null = null;

  constructor(private currentAccount: MCurrentAccount) { }

  @computed get totalTicketPrice() {
    return this.tickets.reduce((prev: number, current) => current.price! + prev, 0);
  }

  @computed get userLevelDiscount() {
    const account = this.currentAccount.loggedAccount as MCurrentUser;
    return account.userLevelDiscount;
  }

  @computed get totalPrice() {
    const account = this.currentAccount.loggedAccount;
    if ((!account) || account.role !== 'USER') {
      return 0;
    }
    const totalTicketPrice = this.totalTicketPrice;
    const couponPrice = this.coupon ? this.coupon.couponType.price : 0;
    const userDiscount = this.userLevelDiscount;
    return (totalTicketPrice - couponPrice) * userDiscount;
  }

  @action setEvent(value: Event | null) {
    this.event = value;
  }

  @action setTickets(value: Partial<Ticket>[]) {
    this.tickets = value;
  }

  @action setCoupon(value: Coupon | null) {
    this.coupon = value;
  }

  @action setSelectedPrice(value: EventSeatPrice | null) {
    this.selectedPrice = value;
  }

  @action clear() {
    this.event = null;
    this.tickets = [];
    this.coupon = null;
    this.selectedPrice = null;
  }

  @action generateOrder = flow(function* (this: MCurrentOrder) {
    if (!this.currentAccount.isLoggedIn) {
      return;
    }
    if (!this.event) {
      return;
    }
    const account = this.currentAccount.loggedAccount;
    if ((!account) || account.role !== 'USER') {
      return;
    }
    yield addNewOrder({
      eventId: this.event.eventId,
      userId: (account.profile as User).userId,
      tickets: this.tickets,
      coupon: this.coupon
    });
    this.clear();
  });

}