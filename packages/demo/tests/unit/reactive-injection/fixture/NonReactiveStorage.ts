import {Injectable} from '@vue-ioc/core';

@Injectable()
export class NotReactiveStorage {
    public bar = 'bar';
}
