import {isVuePrototype} from '../utils/isVuePrototype';
import {createDecorator} from 'vue-class-component';

export function PostConstruct(): any {
    return (target, method) => {
        if (isVuePrototype(target)) {
            return createDecorator((options) => {
                (options as any).$vueIocOnInitMethod = method;
            })(target, method);
        } else {
            target.constructor.$vueIocOnInitMethod = method;
        }
    };
}
