import {createInstanceHandlerDecorator} from '@vue-ioc/core';
import {Reporter} from './Reporter';

export function CustomInstanceHandler() {
    return createInstanceHandlerDecorator(({injector, method, instance}) => {
        const reporter: Reporter = injector.get(Reporter);
        reporter.report('CustomInstanceHandler', 'onActivation:' + instance.constructor.name);
        return () => {
            reporter.report('CustomInstanceHandler', 'beforeDestroy:' + instance.constructor.name);
        };
    });
}
