<template>
    <div>Level2</div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Module, Inject, Injector} from '@vue-ioc/core';
    import {InjectorsRegistry} from './InjectorsRegistry';
    import {OverriddenProvidedInService} from './OverriddenProvidedInService';
    import {ProvidedInRootService} from './ProvidedInRootService';

    @Module({
        providers: [
            ProvidedInRootService,
            {provide: OverriddenProvidedInService, useClass: OverriddenProvidedInService, providedIn: 'root'},
            {provide: 'root_overridden_in_self', useClass: ProvidedInRootService, providedIn: 'self'}
        ]
    })
    @Component({})
    export default class Level2 extends Vue {
        @Inject()
        private injectorsRegistry!: InjectorsRegistry;

        @Inject()
        private injector!: Injector;

        mounted() {
            this.injectorsRegistry.register('Level2', this.injector);
        }
    }
</script>