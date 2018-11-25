import {Injectable} from '@vue-ioc/core';

@Injectable()
export class HttpService {
    public get(url: string): Promise<any> {
        return fetch(url).then((rs) => rs.json());
    }
}
