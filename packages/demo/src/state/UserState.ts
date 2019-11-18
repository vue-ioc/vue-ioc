import {Injectable} from '@vue-ioc/core';

@Injectable()
export class UserState {

    firstName: string = '';

    lastName: string = '';

    isLoading: boolean = true;

    setData(data: any) {
        Object.assign(this, data);
    }

    setIsLoading(isLoading: boolean) {
        this.isLoading = isLoading;
    }
}
