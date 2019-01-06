import {isVuePrototype} from '../utils/isVuePrototype';
import {createDecorator} from 'vue-class-component';

export function OnDestroy(): any {
    return (target, method) => {
        if (isVuePrototype(target)) {
            return createDecorator((options) => {
                (options as any).$vueIocOnDestroyMethod = method;
            })(target, method);
        } else {
            target.constructor.$vueIocOnDestroyMethod = method;
        }
    };
}
