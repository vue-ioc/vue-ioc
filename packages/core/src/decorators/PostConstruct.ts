import {isVuePrototype} from '../utils/isVuePrototype';
import {createDecorator} from 'vue-class-component';
import {$vueIocOnInitMethod} from '../common/magicFields';

export function PostConstruct(): any {
    return (target, method) => {
        if (isVuePrototype(target)) {
            return createDecorator((options) => {
                options[$vueIocOnInitMethod] = method;
            })(target, method);
        } else {
            target.constructor[$vueIocOnInitMethod] = method;
        }
    };
}
