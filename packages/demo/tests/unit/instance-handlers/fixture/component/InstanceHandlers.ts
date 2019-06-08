import Vue from 'vue';
import Component from 'vue-class-component';
import {Inject, Module, BeforeDestroy, PostConstruct} from '@vue-ioc/core';
import {Reporter} from '../Reporter';
import {Service} from '../Service';

@Module({
    providers: [
        Service,
        Reporter,
    ],
    start: [
        Service,
    ],
})
@Component
export default class InstanceHandlers extends Vue {

    @Inject()
    public reporter!: Reporter;

    @PostConstruct()
    public onInit() {
        this.reporter.report('InstanceHandlers', 'onInit');
    }

    public beforeCreate() {
        this.reporter.report('InstanceHandlers', 'beforeCreate');
    }

    public created() {
        this.reporter.report('InstanceHandlers', 'created');
    }

    public mounted() {
        this.reporter.report('InstanceHandlers', 'mounted');
    }

    @BeforeDestroy()
    public onDestroy() {
        this.reporter.report('InstanceHandlers', 'onDestroy');
    }

    public beforeDestroy() {
        this.reporter.report('InstanceHandlers', 'beforeDestroy');
    }

    public destroy() {
        this.reporter.report('InstanceHandlers', 'destroy');
    }

}
