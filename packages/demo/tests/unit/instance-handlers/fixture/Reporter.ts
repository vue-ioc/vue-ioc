import {Injectable, BeforeDestroy, PostConstruct} from '@vue-ioc/core';

@Injectable()
export class Reporter {
    public lifecycleCalls: string[] = [];

    @PostConstruct()
    public onInit() {
        this.report('Reporter', 'onInit');
    }

    @BeforeDestroy()
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
