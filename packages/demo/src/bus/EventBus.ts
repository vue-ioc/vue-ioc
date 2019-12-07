import Vue from 'vue';
import {Injectable} from '@vue-ioc/core';

@Injectable()
export class EventBus {

    private bus: Vue = new Vue();

    public dispatch(name: string, data: any) {
        this.bus.$emit(name, data);
    }

    public addListener(name: string, listener: (data: any) => void) {
        this.bus.$on(name, listener);
    }

    public removeListener(name: string, listener: (data: any) => void) {
        this.bus.$off(name, listener);
    }
}
