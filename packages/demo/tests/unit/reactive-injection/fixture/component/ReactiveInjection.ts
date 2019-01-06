import Vue from 'vue';
import Component from 'vue-class-component';
import {Inject, InjectReactive, Module} from '@vue-ioc/core';
import {ReactiveStorage} from '../ReactiveStorage';
import {NotReactiveStorage} from '../NonReactiveStorage';

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
