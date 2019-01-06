import {Injectable, OnDestroy, OnInit} from '@vue-ioc/core';

@Injectable()
export class Reporter {
    public lifecycleCalls: string[] = [];

    @OnInit()
    public onInit() {
        this.report('Reporter', 'onInit');
    }

    @OnDestroy()
    public onDestroy() {
        this.report('Reporter', 'onDestroy');
    }

    public report(className: string, method: string) {
        this.lifecycleCalls.push(`${className}.${method}`);
    }

    public reset() {
        this.lifecycleCalls = [];
    }
}
