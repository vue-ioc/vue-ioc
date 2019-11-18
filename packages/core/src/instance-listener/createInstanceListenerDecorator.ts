import {isVuePrototype} from '../utils/isVuePrototype';
import {createDecorator} from 'vue-class-component';
import {$vueIocInstanceListenerMethods} from '../common/magicFields';

export type detachHandler = () => void;
export type attachHandler = ({container: Container, instance: any, method: string}) => detachHandler

export function createInstanceListenerDecorator(handler: attachHandler) {
    return (target: any, method: string) => {
        if (isVuePrototype(target)) {
            return createDecorator((options) => {
                if (!options[$vueIocInstanceListenerMethods]) {
                    options[$vueIocInstanceListenerMethods] = [];
                }
                options[$vueIocInstanceListenerMethods].push({method, handler});
            })(target, method);
        } else {
            const ctor = target.constructor;
            if (!ctor[$vueIocInstanceListenerMethods]) {
                ctor[$vueIocInstanceListenerMethods] = [];
            }
            ctor[$vueIocInstanceListenerMethods].push({method, handler});
        }
    };
}
