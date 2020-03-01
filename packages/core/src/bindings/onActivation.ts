import {LifecycleHandler} from '../lifecycle/LifecycleHandler';
import { Context } from '../types';

export const onActivation = (context: Context, instance) => {
    if (instance instanceof LifecycleHandler) {
        return instance;
    }
    const lifecycleHandler = context.container.get(LifecycleHandler);
    lifecycleHandler.registerInstance(instance);
    return instance;
};
