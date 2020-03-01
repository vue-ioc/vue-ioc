import {Container} from 'inversify';
import {IBaseBinding} from './Binding';
import {onActivation} from './onActivation';
import { Newable } from '../types';

export interface IClassBinding extends IBaseBinding {
    useClass: Newable<any>;
    noSingleton?: boolean;
}

export const bindClass = (container: Container, {provide, useClass, noSingleton}: IClassBinding) => {
    if (container.isBound(provide)) {
        return;
    }
    const binding = container.bind(provide).to(useClass);
    binding.onActivation(onActivation);
    if (noSingleton) {
        binding.inTransientScope();
    }
};

