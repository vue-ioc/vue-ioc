import {Inject, Injectable} from '@vue-ioc/core';
import {OnEvent} from '../bus/OnEvent';
import {UserState} from '@/state/UserState';

@Injectable()
export class ChangeLastName {

    @Inject()
    userState!: UserState;

    @OnEvent('changeLastName')
    perform(lastName: string) {
        this.userState.setData({lastName});
    }
}
