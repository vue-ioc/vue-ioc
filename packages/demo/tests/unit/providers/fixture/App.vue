<template>
    <div>Root</div>

</template>
<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Module, Inject, Injector} from '@vue-ioc/core';
    import {BAR_VALUE_TOKEN, FACTORY_FUNCTION_SERVICE_TOKEN, FOO_SERVICE_TOKEN} from './container-tokens';
    import {FooService} from './FooService';
    import {factoryFunctionService} from './factoryFunctionService';

    @Module({
        providers: [
            {provide: FOO_SERVICE_TOKEN, useClass: FooService},
            {provide: BAR_VALUE_TOKEN, useValue: 'BAR_VALUE'},
            {
                provide: FACTORY_FUNCTION_SERVICE_TOKEN,
                useFactory: (injector: Injector) => factoryFunctionService(injector.get(FOO_SERVICE_TOKEN))
            }
        ]
    })
    @Component
    export default class App extends Vue {

        @Inject(BAR_VALUE_TOKEN)
        private barValue!:string;

        @Inject(FOO_SERVICE_TOKEN)
        private fooService!:FooService;

        @Inject(FACTORY_FUNCTION_SERVICE_TOKEN)
        private factoryFunctionService!:ReturnType<typeof factoryFunctionService>;
    }
</script>