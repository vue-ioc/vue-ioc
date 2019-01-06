import {Container, interfaces} from 'inversify';
import {IBaseBinding} from './Binding';
import {onActivation} from './onActivation';
import Context = interfaces.Context;

export interface IFactoryBinding extends IBaseBinding {
    useFactory: (context: Context) => any;
}

export const bindFactory = (container: Container, {provide, useFactory}: IFactoryBinding) => {
    container.bind(provide).toDynamicValue(useFactory).onActivation(onActivation);
};
