import Vue from 'vue';
import Component from 'vue-class-component';
import {Inject, InjectReactive, Injectable, Module} from '@vue-ioc/core';

@Injectable()
export class ReactiveStorage {
    public foo = 'foo';
}

@Injectable()
export class NotReactiveStorage {
    public bar = 'bar';
}

@Module({
    providers: [
        ReactiveStorage,
        NotReactiveStorage,
    ],
})
@Component
export default class ReactiveInjection extends Vue {

    @InjectReactive()
    public reactiveStorage!: ReactiveStorage;

    @Inject()
    public notReactiveStorage!: NotReactiveStorage;

}
