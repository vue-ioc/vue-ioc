import {$vueIocInstanceListenerMethods, $vueIocOnDestroyMethod, $vueIocOnInitMethod} from '../common/magicFields';
import {Injector} from '../injector/Injector';

export class LifecycleHandler {

    private containerInstances: any[] = [];
    private beforeDestroyCustomInstanceListeners: any[] = [];

    constructor(private injector: Injector) {
    }

    public registerInstance(instance: any) {
        const ctor = instance.constructor;
        const item = {
            instance,
            onInit: ctor[$vueIocOnInitMethod],
            onDestroy: ctor[$vueIocOnDestroyMethod],
            customInstanceListeners: ctor[$vueIocInstanceListenerMethods],
        };
        this.containerInstances.push(item);
        this.callCustomInstanceListeners(item);
        callOnInitMethod(item);
    }

    public destroy() {
        this.containerInstances.forEach(callOnDestroyMethod);
        this.containerInstances = [];
        this.beforeDestroyCustomInstanceListeners.forEach(callBeforeDestroyCustomListener);
        this.beforeDestroyCustomInstanceListeners = [];
    }

    private callCustomInstanceListeners({instance, customInstanceListeners}) {
        const injector = this.injector;
        this.beforeDestroyCustomInstanceListeners = (customInstanceListeners || []).map(({method, handler}) => {
            return handler({method, instance, injector});
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
