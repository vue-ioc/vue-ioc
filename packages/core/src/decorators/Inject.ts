import {inject, interfaces, multiInject} from 'inversify';
import 'reflect-metadata';
import {createDecorator, VueDecorator} from 'vue-class-component';
import ServiceIdentifier = interfaces.ServiceIdentifier;

export function InjectReactive(identifier?: any): any {
    if (arguments.length > 1) {
        throw new Error('Please use @InjectReactive() with parentheses');
    } else {
        return (target: object, propertyKey: string, parameterIndex?: number) => {
            return decorate(target, propertyKey, parameterIndex, identifier, {reactive: true});
        };
    }
}

export function Inject(identifier?: any): any {
    if (arguments.length > 1) {
        throw new Error('Please use @Inject() with parentheses');
    } else {
        return (target: object, propertyKey: string, parameterIndex?: number) => {
            return decorate(target, propertyKey, parameterIndex, identifier);
        };
    }
}

function decorate(target: any,
                  propertyKey: string,
                  parameterIndex: number | undefined,
                  identifier?: ServiceIdentifier<any>,
                  injectConfig: InjectConfig = {reactive: false}) {
    if (typeof parameterIndex === 'number') {
        injectConstructorArgument(target, propertyKey, parameterIndex, identifier);
    } else {
        if (isVuePrototype(target)) {
            return injectPropertyToVueComponent(target, propertyKey, identifier, injectConfig)(target, propertyKey);
        } else {
            return injectProperty(target, propertyKey, identifier);
        }
    }
}

function injectConstructorArgument(target: any,
                                   propertyKey: string | symbol,
                                   parameterIndex: number,
                                   identifier?: ServiceIdentifier<any>) {
    const type = Reflect.getMetadata('design:paramtypes', target)[parameterIndex];
    const isArrayType = type === Array;
    const injectMethod = isArrayType ? multiInject : inject;
    injectMethod(identifier || type)(target, propertyKey as string, parameterIndex);
}

function injectProperty(target: object, propertyKey: string | symbol, identifier?: any) {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    const isArrayType = type === Array;
    const injectMethod = isArrayType ? multiInject : inject;
    injectMethod(identifier || type)(target, propertyKey as string);
}

function injectPropertyToVueComponent(target: any,
                                      propertyKey: string,
                                      identifier?: any,
                                      injectConfig: InjectConfig = {reactive: false}): VueDecorator {
    const type = Reflect.getMetadata('design:type', target, propertyKey);
    const isArrayType = type === Array;
    return createDecorator((options: any) => {
        if (!options.$vueIocInjections) {
            options.$vueIocInjections = {};
        }
        options.$vueIocInjections[propertyKey] = {
            isArrayType,
            identifier: identifier || type,
            reactive: injectConfig.reactive,
        };
    });
}

function isVuePrototype(target: any) {
    return target.$nextTick && target.$watch; // todo - better way to detect Vue prototype
}

interface InjectConfig {
    reactive?: boolean;
}
