import Vue from 'vue';
import {Injectable} from '@vue-ioc/core';

@Injectable()
export class EventBus {

    private bus: Vue = new Vue();

    dispatch(name: string, data: any) {
        this.bus.$emit(name, data);
    }

    addListener(name: string, listener: (data: any) => void) {
        this.bus.$on(name, listener)
    }

    removeListener(name: string, listener: (data: any) => void) {
        this.bus.$off(name, listener)
    }
}
