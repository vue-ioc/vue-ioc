import {Injectable, Injector} from '@vue-ioc/core';

@Injectable()
export class InjectorsRegistry {

    private injectors: { [key: string]: Injector } = {};

    public register(moduleName: string, injector: Injector) {
        this.injectors[moduleName] = injector;
    }

    public getInjector(moduleName: string): Injector {
        return this.injectors[moduleName];
    }
}
