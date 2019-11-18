import {interfaces} from 'inversify';
import {LifecycleHandler} from '../lifecycle/LifecycleHandler';
import Context = interfaces.Context;

export const onActivation = (context: Context, instance) => {
    if (instance instanceof LifecycleHandler) {
        return instance;
    }
    const lifecycleHandler = context.container.get(LifecycleHandler);
    lifecycleHandler.registerInstance(instance, context.container);
    return instance;
};
