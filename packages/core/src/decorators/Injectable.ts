import {injectable} from 'inversify';
import {$vueIocProvidedIn} from '../common/magicFields';
import {ProvidedIn} from '../types';

export interface InjectableOptions {
    providedIn?: ProvidedIn;
}

export function Injectable(options: InjectableOptions = {providedIn: 'self'}) {
    if (arguments.length === 3) {
        throw new Error('Please use @Injectable() with parentheses');
    }
    return (target, ...args) => {
        // do vue-ioc stuff here
        target[$vueIocProvidedIn] = options.providedIn;
        return injectable()(target);
    };
}
