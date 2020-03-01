import {Container} from 'inversify';
import {Binding, executeBindings} from './bindings/Binding';
import {ServiceIdentifier, Vue} from './types';


export interface IContainerOptions {
    vm: Vue;
    providers?: Binding[];
    parent?: Container | null;
    initOnStart?: Array<ServiceIdentifier<any>>;
}

export function createContainerWithBindings({providers, parent, vm, initOnStart}: IContainerOptions) {
    const containerOptions = {
        autoBindInjectable: false,
        defaultScope: 'Singleton' as 'Singleton',
    };
    const container = parent ? parent.createChild(containerOptions) : new Container(containerOptions);
    executeBindings(container, providers, vm);
    (initOnStart || []).forEach((identifier) => container.get(identifier));
    return container;
}
