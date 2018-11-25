import {Container, interfaces} from 'inversify';
import {Binding, executeBindings} from './bindings/Binding';
import ServiceIdentifier = interfaces.ServiceIdentifier;

export interface IContainerOptions {
    providers?: Binding[];
    autoBindInjectable?: boolean;
    parent?: Container | null;
    initOnStart?: Array<ServiceIdentifier<any>>;
}

export function createContainerWithBindings({autoBindInjectable, providers, parent, initOnStart}: IContainerOptions) {
    const DEFAULT_AUTO_BIND = false;
    const containerOptions = {
        autoBindInjectable: autoBindInjectable !== void 0 ? autoBindInjectable : DEFAULT_AUTO_BIND,
        defaultScope: 'Singleton' as 'Singleton',
    };
    const container = parent ? parent.createChild(containerOptions) : new Container(containerOptions);
    executeBindings(container, providers);
    (initOnStart || []).forEach((identifier) => container.get(identifier));
    return container;
}
