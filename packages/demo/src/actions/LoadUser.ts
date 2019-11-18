import {Inject, Injectable, PostConstruct} from '@vue-ioc/core';
import {UserState} from '../state/UserState';
import {UserService} from '../services/UserService';

@Injectable()
export class LoadUser {

    @Inject()
    userState!: UserState;

    @Inject()
    userService!: UserService;

    @PostConstruct()
    async init() {
        this.userState.setData(await this.userService.getUser());
        this.userState.setIsLoading(false)
    }
}
