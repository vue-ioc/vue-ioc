import {Container, interfaces} from 'inversify';
import {bindFactory, IFactoryBinding} from './IFactoryBinding';
import {bindClass, IClassBinding} from './IClassBinding';
import {bindValue, IValueBinding} from './IValueBinding';
import {LifecycleHandler} from '../lifecycle/LifecycleHandler';
import ServiceIdentifier = interfaces.ServiceIdentifier;
import Newable = interfaces.Newable;

export type Binding = IClassBinding | IValueBinding | IFactoryBinding | Newable<any>;

export interface IBaseBinding {
    provide: ServiceIdentifier<any>;
}

const bindings = {
    useClass: bindClass,
    useFactory: bindFactory,
    useValue: bindValue,
};

export const executeBindings = (container: Container, providers: Binding[] = []) => {
    bindClass(container, {useClass: LifecycleHandler, provide: LifecycleHandler});
    providers.forEach((provider: any) => {
        if (typeof provider === 'function') {
            bindings.useClass(container, {useClass: provider, provide: provider});
        } else {
            Object.keys(bindings)
                .forEach((key) => {
                    if (provider[key]) {
                        // @ts-ignore
                        bindings[key](container, provider);
                    }
                });
        }
    });
};
