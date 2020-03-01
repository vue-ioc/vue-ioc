import {createInstanceHandlerDecorator} from '@vue-ioc/core';
import {EventBus} from '@/bus/EventBus';

export function OnEvent(name: string) {
    return createInstanceHandlerDecorator(({injector, instance, method}) => {
        const bus: EventBus = injector.get(EventBus);
        const boundMethod = instance[method].bind(instance);
        bus.addListener(name, boundMethod);
        return () => {
            bus.removeListener(name, boundMethod);
        };
    });
}
