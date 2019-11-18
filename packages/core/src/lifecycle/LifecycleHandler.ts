import {Injectable} from '../decorators/Injectable';
import {interfaces} from 'inversify';
import {$vueIocInstanceListenerMethods, $vueIocOnDestroyMethod, $vueIocOnInitMethod} from '../common/magicFields';

type Container = interfaces.Container

@Injectable()
export class LifecycleHandler {

    private containerInstances: any[] = [];
    private beforeDestroyCustomInstanceListeners: any[] = [];

    public registerInstance(instance: any, container: Container) {
        const ctor = instance.constructor;
        const item = {
            instance,
            onInit: ctor[$vueIocOnInitMethod],
            onDestroy: ctor[$vueIocOnDestroyMethod],
            customInstanceListeners: ctor[$vueIocInstanceListenerMethods],
        };
        this.containerInstances.push(item);
        this.callCustomInstanceListeners(item, container);
        callOnInitMethod(item);
    }

    public destroy() {
        this.containerInstances.forEach(callOnDestroyMethod);
        this.containerInstances = [];
        this.beforeDestroyCustomInstanceListeners.forEach(callBeforeDestroyCustomListener);
        this.beforeDestroyCustomInstanceListeners = [];
    }

    private callCustomInstanceListeners({instance, customInstanceListeners}, container: Container) {
        this.beforeDestroyCustomInstanceListeners = (customInstanceListeners || []).map(({method, handler}) => {
            return handler({method, instance, container});
        });
    }
}

function callOnInitMethod({instance, onInit}) {
    if (onInit) {
        instance[onInit]();
    }
}

function callOnDestroyMethod({instance, onDestroy}) {
    if (onDestroy) {
        instance[onDestroy]();
    }
}

function callBeforeDestroyCustomListener(customListenerBeforeDestroy?: () => void) {
    customListenerBeforeDestroy && customListenerBeforeDestroy();
}
