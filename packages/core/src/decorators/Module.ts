import {Binding} from '../bindings/Binding';
import {Container} from 'inversify';
import {$vueIocModuleOptions} from '../common/magicFields';
import { ServiceIdentifier } from '../types';

export function Module(options: IModuleOptions) {
    return (targetConstructor: any) => {
        targetConstructor.prototype[$vueIocModuleOptions] = options;
        return targetConstructor;
    };
}

export type Imports = any[];

export interface IModuleOptions {
    imports?: Imports;
    providers?: Binding[];
    parentContainer?: Container;
    start?: Array<ServiceIdentifier<any>>;
}
