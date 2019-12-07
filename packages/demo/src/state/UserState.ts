import {Injectable} from '@vue-ioc/core';

@Injectable()
export class UserState {

    public firstName: string = '';

    public lastName: string = '';

    public isLoading: boolean = true;

    public setData(data: any) {
        Object.assign(this, data);
    }

    public setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }
}
