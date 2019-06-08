import {Inject, Injectable, BeforeDestroy, PostConstruct} from '@vue-ioc/core';
import {Reporter} from './Reporter';

@Injectable()
export class Service {

    @Inject()
    public reporter!: Reporter;

    @PostConstruct()
    public onInit() {
        this.reporter.report('Service', 'onInit');
    }

    @BeforeDestroy()
    public onDestroy() {
        this.reporter.report('Service', 'onDestroy');
    }
}
