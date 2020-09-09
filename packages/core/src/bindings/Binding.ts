import {Container} from 'inversify';
import {bindFactory, IFactoryBinding} from './IFactoryBinding';
import {bindClass, IClassBinding} from './IClassBinding';
import {bindValue, IValueBinding} from './IValueBinding';
import {LifecycleHandler} from '../lifecycle/LifecycleHandler';
import {Newable, ProvidedIn, ServiceIdentifier, Vue} from '../types';
import {Injector} from '../injector/Injector';
import {$vueIocContainer, $vueIocProvidedIn} from '../common/magicFields';

export type Binding = IClassBinding | IValueBinding | IFactoryBinding | Newable<any>;

export interface IBaseBinding {
    provide: ServiceIdentifier<any>;
    providedIn?: ProvidedIn;
}

const bindings = {
    useClass: bindClass,
    useFactory: bindFactory,
    useValue: bindValue,
};

export const executeBindings = (container: Container, providers: Binding[] = [], vm: Vue) => {
    const injector = new Injector(container);
    container.bind(Injector).toConstantValue(injector);
    container.bind(LifecycleHandler).toConstantValue(new LifecycleHandler(injector));

    providers.forEach((provider: any) => {
        const ctr = resolveContainer(provider, container, vm);
        if (typeof provider === 'function') {
            bindings.useClass(ctr, {useClass: provider, provide: provider});
        } else {
            Object.keys(bindings)
                .forEach((key) => {
                    if (provider[key]) {
                        // @ts-ignore
                        bindings[key](ctr, provider);
                    }
                });
        }
    });
};

function resolveContainer(provider: Binding, currentContainer: Container, vm: Vue): Container {
    const providedIn = resolveProvidedIn(provider);
    switch (providedIn) {
        case 'root':
            return findRootContainer(vm);
        case 'self':
            return currentContainer;
    }
    throw new Error('Invalid providedIn: ' + providedIn);
}

const PROVIDED_IN_PROPERTY = 'providedIn';
const USE_CLASS_PROPERTY = 'useClass';

function resolveProvidedIn(provider: Binding) {
    if (provider[PROVIDED_IN_PROPERTY]) { // overrides all below
        return provider[PROVIDED_IN_PROPERTY];
    }

    if (typeof provider === 'function' && provider[$vueIocProvidedIn]) {
        return provider[$vueIocProvidedIn];
    }

    if (provider[USE_CLASS_PROPERTY] && provider[USE_CLASS_PROPERTY][PROVIDED_IN_PROPERTY]) {
        return provider[USE_CLASS_PROPERTY][PROVIDED_IN_PROPERTY];
    }

    return 'self';
}

function findRootContainer(vm: Vue): Container {
    let $parent = vm;
    while ($parent) {
        if ($parent[$vueIocContainer]) {
            const container = $parent[$vueIocContainer];
            if (!container.parent) {
                return container;
            }
        }
        $parent = $parent.$parent;
    }
    throw new Error('Couldn\'t find root container');
}
