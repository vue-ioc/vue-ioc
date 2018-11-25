import {Injectable} from '@vue-ioc/core';
import {HttpService} from '@/services/HttpService';

@Injectable()
export class UserService {

    constructor(private httpService: HttpService) {
    }

    public async getUser() {
        return await this.httpService.get('/user.json');
    }
}
