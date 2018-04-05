import { observable, action, computed } from 'mobx';
import { User, Role, Venue, Manager } from '../model/models';
import { removeAuth } from '../netAccess/authentication';
import { getJWTPayload } from '../util/JWTUtil';

interface Account {
    profile: User | Venue | Manager;
    role: Role;
}

export class MCurrentAccount {

    @observable loggedAccount: Account | null = null;

    constructor() {
        // 检查本地存储中的登录token
        const token = localStorage.getItem('token');
        if (token) {
            const data = getJWTPayload(token);
            this.login(createAccount(data.sub, data)!);
        }
    }

    @computed get isLoggedIn() {
        return !!this.loggedAccount;
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
        if (!this.profile) {
            return 0;
        }
        const discountIncrement = 0.03;
        return 1 - (this.profile.level - 1) * discountIncrement;
    }

}

export class MCurrentVenue implements Account {

    role = 'VENUE' as Role;

    @observable profile: Venue;

    constructor(profile: Venue) {
        this.profile = profile;
    }

}

export class MCurrentManager implements Account {

    role = 'MANAGER' as Role;

    @observable profile: Manager;

    constructor(profile: Manager) {
        this.profile = profile;
    }

}

export function createAccount(role: Role, profile: User | Venue | Manager): Account | null {
    switch (role) {
        case 'MANAGER':
            return new MCurrentManager(profile as Manager);
        case 'USER':
            return new MCurrentUser(profile as User);
        case 'VENUE':
            return new MCurrentVenue(profile as Venue);
        default:
            return null;
    }
}
