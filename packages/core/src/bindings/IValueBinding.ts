import {Container} from 'inversify';
import {IBaseBinding} from './Binding';
import {onActivation} from './onActivation';

export interface IValueBinding extends IBaseBinding {
    useValue: any;
}

export const bindValue = (container: Container, {provide, useValue}: IValueBinding) => {
    if (container.isBound(provide)) {
        return;
    }
    container.bind(provide).toConstantValue(useValue).onActivation(onActivation);
};
