import {Inject, Injectable, PostConstruct} from '@vue-ioc/core';
import {UserState} from '../state/UserState';
import {UserService} from '../services/UserService';

@Injectable()
export class LoadUser {

    @Inject()
    public userState!: UserState;

    @Inject()
    public userService!: UserService;

    @PostConstruct()
    public async init() {
        this.userState.setData(await this.userService.getUser());
        this.userState.setIsLoading(false);
    }
}
