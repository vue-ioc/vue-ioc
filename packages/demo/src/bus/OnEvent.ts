import {createInstanceListenerDecorator} from '@vue-ioc/core';
import {EventBus} from '@/bus/EventBus';

export function OnEvent(name: string) {
    return createInstanceListenerDecorator(({container, instance, method}) => {
        const bus: EventBus = container.get(EventBus);
        const boundMethod = instance[method].bind(instance);
        bus.addListener(name, boundMethod);
        return () => {
            bus.removeListener(name, boundMethod);
        };
    });
}
