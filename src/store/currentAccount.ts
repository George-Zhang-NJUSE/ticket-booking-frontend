import { observable, action, computed, flow } from 'mobx';
import { User, Role, Venue, Manager, AuthTokenBody } from '../model/models';
import { removeAuth } from '../netAccess/authentication';
import { getJWTPayload } from '../util/JWTUtil';
import { getManager } from '../netAccess/manager';
import { getUser } from '../netAccess/user';
import { getVenue } from '../netAccess/venue';

interface Account {
  profile: User | Venue | Manager;
  role: Role;
}

export class MCurrentAccount {

  @observable loggedAccount: Account | null = null;

  constructor() {
    this.init();
  }

  @computed get isLoggedIn() {
    return !!this.loggedAccount;
  }

  private async init() {
    // 检查本地存储中的登录token
    const token = localStorage.getItem('token');
    if (token) {
      const body = getJWTPayload(token) as AuthTokenBody;
      const account = await createAccountFromAuthTokenBody(body);
      account && this.login(account);
    }
  }

  @action login(account: Account) {
    this.loggedAccount = account;
  }

  @action logout() {
    this.loggedAccount = null;
    removeAuth();
  }
}

export class MCurrentUser implements Account {

  role = 'USER' as Role;

  @observable profile: User;

  constructor(profile: User) {
    this.profile = profile;
  }

  @computed get userLevelDiscount() {
    const discountIncrement = 0.03;
    return 1 - (this.profile.level - 1) * discountIncrement;
  }

  @action refreshProfile = flow(function* (this: MCurrentUser) {
    const user: User = yield getUser(this.profile.userId);
    this.profile = user;
  });

}

export class MCurrentVenue implements Account {

  role = 'VENUE' as Role;

  @observable profile: Venue;

  constructor(profile: Venue) {
    this.profile = profile;
  }

  @action refreshProfile = flow(function* (this: MCurrentVenue) {
    const venue: Venue = yield getVenue(this.profile.venueId);
    this.profile = venue;
  });

}

export class MCurrentManager implements Account {

  role = 'MANAGER' as Role;

  @observable profile: Manager;

  constructor(profile: Manager) {
    this.profile = profile;
  }

}

export async function createAccountFromAuthTokenBody(tokenBody: AuthTokenBody) {
  const { sub, id } = tokenBody;
  let profile;
  // tslint:disable-next-line:switch-default
  switch (sub) {
    case 'MANAGER':
      profile = await getManager(id);
      break;
    case 'USER':
      profile = await getUser(id);
      break;
    case 'VENUE':
      profile = await getVenue(id);
      break;
  }
  if (profile) {
    return createAccount(sub, profile);
  }
  return null;
}

export function createAccount(role: Role, profile: User | Venue | Manager): Account {
  // tslint:disable-next-line:switch-default
  switch (role) {
    case 'MANAGER':
      return new MCurrentManager(profile as Manager);
    case 'USER':
      return new MCurrentUser(profile as User);
    case 'VENUE':
      return new MCurrentVenue(profile as Venue);
  }
}
