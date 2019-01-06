import {Container, interfaces} from 'inversify';
import {IBaseBinding} from './Binding';
import {onActivation} from './onActivation';
import Newable = interfaces.Newable;

export interface IClassBinding extends IBaseBinding {
    useClass: Newable<any>;
    noSingleton?: boolean;
}

export const bindClass = (container: Container, {provide, useClass, noSingleton}: IClassBinding) => {
    const binding = container.bind(provide).to(useClass);
    binding.onActivation(onActivation);
    if (noSingleton) {
        binding.inTransientScope();
    }
};

