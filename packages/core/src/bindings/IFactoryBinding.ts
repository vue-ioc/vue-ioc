import {Container} from 'inversify';
import {IBaseBinding} from './Binding';
import {onActivation} from './onActivation';
import {Injector} from '../injector/Injector';

export interface IFactoryBinding extends IBaseBinding {
    useFactory: (injector: Injector) => any;
}

export const bindFactory = (container: Container, {provide, useFactory}: IFactoryBinding) => {
    if (container.isBound(provide)) {
        return;
    }
    function useInjectorFactory(context) {
        return useFactory(context.container.get(Injector));
    }
    container.bind(provide).toDynamicValue(useInjectorFactory).onActivation(onActivation);
};
