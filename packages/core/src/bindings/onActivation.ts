import {interfaces} from 'inversify';
import Context = interfaces.Context;
import {LifecycleHandler} from '../lifecycle/LifecycleHandler';

export const onActivation = (context: Context, instance) => {
    if (instance instanceof LifecycleHandler) {
        return instance;
    }
    const lifecycleHandler = context.container.get(LifecycleHandler);
    lifecycleHandler.registerInstance(instance);
    return instance;
};
