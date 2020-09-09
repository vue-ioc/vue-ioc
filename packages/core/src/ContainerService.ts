import {Container, interfaces} from 'inversify';
import {Binding, executeBindings} from './bindings/Binding';
import {ServiceIdentifier, Vue} from './types';
import ContainerOptions = interfaces.ContainerOptions;


export interface IContainerOptions {
    vm: Vue;
    providers?: Binding[];
    parent?: Container | null;
    initOnStart?: Array<ServiceIdentifier<any>>;
    containerOptions?: ContainerOptions
}

const DEFAULT_CONTAINER_OPTIONS = {
    autoBindInjectable: false,
    defaultScope: 'Singleton' as 'Singleton',
    skipBaseClassChecks: true
};

export function createContainerWithBindings({providers, parent, vm, initOnStart, containerOptions}: IContainerOptions) {
    const options = {
        ...DEFAULT_CONTAINER_OPTIONS,
        ...containerOptions,
    };
    const container = parent ? parent.createChild(options) : new Container(options);
    executeBindings(container, providers, vm);
    (initOnStart || []).forEach((identifier) => container.get(identifier));
    return container;
}
