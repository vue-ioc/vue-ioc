<template>
    <div>
        Level1
        <Level2/>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Module, Injector, Inject} from '@vue-ioc/core';
    import {ProvidedInRootService} from './ProvidedInRootService';
    import Level2 from './Level2.vue';
    import {InjectorsRegistry} from './InjectorsRegistry';

    @Module({
        providers: [
            ProvidedInRootService
        ]
    })
    @Component({
        components: {
            Level2
        }
    })
    export default class Level1 extends Vue {
        @Inject()
        private injectorsRegistry!:InjectorsRegistry;

        @Inject()
        private injector!:Injector;

        mounted() {
            this.injectorsRegistry.register('Level1', this.injector)
        }
    }
</script>