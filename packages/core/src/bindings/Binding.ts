import {Container, interfaces} from 'inversify';
import {bindFactory, IFactoryBinding} from './IFactoryBinding';
import ServiceIdentifier = interfaces.ServiceIdentifier;
import {bindClass, IClassBinding} from './IClassBinding';
import {bindValue, IValueBinding} from './IValueBinding';
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
