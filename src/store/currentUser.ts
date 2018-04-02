import { observable, action, computed } from 'mobx';
import { User } from '../model/models';

export class MCurrentUser {

    @observable loggedUser: User | null = null;

    @computed get isLoggedIn() {
        return !!this.loggedUser;
    }

    @action login(user: User) {
        this.loggedUser = user;
    }

    @action logout() {
        this.loggedUser = null;
    }
}