import {Injectable} from '../decorators/Injectable';

@Injectable()
export class LifecycleHandler {

    private containerInstances: any[] = [];

    public registerInstance(instance: any) {
        const item = {
            instance,
            onInit: instance.constructor.$vueIocOnInitMethod,
            onDestroy: instance.constructor.$vueIocOnDestroyMethod,
        };
        this.containerInstances.push(item);
        callOnInitMethod(item);
    }

    public destroy() {
        this.containerInstances.forEach(callOnDestroyMethod);
        this.containerInstances = [];
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
