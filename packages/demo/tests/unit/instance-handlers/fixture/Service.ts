import {Inject, Injectable, OnDestroy, OnInit} from '@vue-ioc/core';
import {Reporter} from './Reporter';

@Injectable()
export class Service {

    @Inject()
    public reporter!: Reporter;

    @OnInit()
    public onInit() {
        this.reporter.report('Service', 'onInit');
    }

    @OnDestroy()
    public onDestroy() {
        this.reporter.report('Service', 'onDestroy');
    }
}
