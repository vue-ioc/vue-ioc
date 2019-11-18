import {BeforeDestroy, Inject, Injectable, PostConstruct} from '@vue-ioc/core';
import {Reporter} from './Reporter';
import {CustomInstanceHandler} from './CustomInstanceHandler';

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

    @CustomInstanceHandler()
    public customInstanceHandler() {
        this.reporter.report('Service', 'customInstanceHandler');
    }
}
