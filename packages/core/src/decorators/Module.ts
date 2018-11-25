import {Binding} from '../bindings/Binding';
import {Container, interfaces} from 'inversify';
import ServiceIdentifier = interfaces.ServiceIdentifier;

export function Module(options: IModuleOptions) {
    return (targetConstructor: any) => {
        targetConstructor.prototype.$vueIocModuleOptions = options;
        return targetConstructor;
    };
}

export type Imports = any[];

export interface IModuleOptions {
    imports?: Imports;
    providers?: Binding[];
    autoBindInjectable?: boolean;
    parentContainer?: Container;
    start?: Array<ServiceIdentifier<any>>;
}