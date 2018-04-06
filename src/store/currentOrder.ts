import { observable, action, computed, flow } from 'mobx';
import { message } from 'antd';
import { Ticket, Coupon, User } from '../model/models';
import { MCurrentAccount, MCurrentUser } from './currentAccount';
import { addNewOrder } from '../netAccess/order';

export class MCurrentOrder {

  @observable eventId = 0;

  @observable tickets: Partial<Ticket>[] = [];

  @observable coupon: Coupon | null = null;

  constructor(private currentAccount: MCurrentAccount) { }

  @computed get totalPrice() {
    const account = this.currentAccount.loggedAccount;
    if ((!account) || account.role !== 'USER') {
      return;
    }
    const totalTicketPrice = this.tickets.reduce((prev: number, current) => current.price! + prev, 0);
    const couponPrice = this.coupon ? this.coupon.couponType.price : 0;
    const userDiscount = (account as MCurrentUser).userLevelDiscount;
    return (totalTicketPrice - couponPrice) * userDiscount;
  }

  @action setEventId(value: number) {
    this.eventId = value;
  }

  @action setTickets(value: Partial<Ticket>[]) {
    this.tickets = value;
  }

  @action setCoupon(value: Coupon | null) {
    this.coupon = value;
  }

  @action clear() {
    this.eventId = 0;
    this.tickets = [];
    this.coupon = null;
  }

  @action generateOrder = flow(function* (this: MCurrentOrder) {
    if (!this.currentAccount.isLoggedIn) {
      return;
    }
    const account = this.currentAccount.loggedAccount;
    if ((!account) || account.role !== 'USER') {
      return;
    }
    try {
      yield addNewOrder({
        eventId: this.eventId,
        userId: (account.profile as User).userId,
        tickets: this.tickets
      });
      this.clear();
    } catch (err) {
      console.log(err);
      message.error('出错啦！请检查你的网络连接。');
    }
  });

}