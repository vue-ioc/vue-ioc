import {isVuePrototype} from '../utils/isVuePrototype';
import {createDecorator} from 'vue-class-component';
import {$vueIocOnDestroyMethod} from '../common/magicFields';

export function BeforeDestroy(): any {
    return (target, method) => {
        if (isVuePrototype(target)) {
            return createDecorator((options) => {
                options[$vueIocOnDestroyMethod] = method;
            })(target, method);
        } else {
            target.constructor[$vueIocOnDestroyMethod] = method;
        }
    };
}
