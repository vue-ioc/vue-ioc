import {Container} from 'inversify';
import {IBaseBinding} from './Binding';

export interface IValueBinding extends IBaseBinding {
    useValue: any;
}

export const bindValue = (container: Container, {provide, useValue}: IValueBinding) => {
    container.bind(provide).toConstantValue(useValue);
};
