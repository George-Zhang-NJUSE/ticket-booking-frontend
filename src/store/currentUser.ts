import { observable, action, computed } from 'mobx';
import { User } from '../model/models';

export class MCurrentUser {

    @observable loggedUser: User | null = null;

    @computed get isLoggedIn() {
        return !!this.loggedUser;
    }

    @computed get userLevelDiscount() {
        if (!this.loggedUser) {
            return 0;
        }
        const discountIncrement = 0.03;
        return 1 - (this.loggedUser.level - 1) * discountIncrement;
    }

    @action login(user: User) {
        this.loggedUser = user;
    }

    @action logout() {
        this.loggedUser = null;
    }
}