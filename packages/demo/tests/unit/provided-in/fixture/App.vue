<template>
    <div>
        Root
        <Level1/>
    </div>

</template>
<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Module, Inject, Injector} from '@vue-ioc/core';
    import {InjectorsRegistry} from './InjectorsRegistry';
    import Level1 from './Level1.vue'

    @Module({
        providers: [
            InjectorsRegistry
        ]
    })
    @Component({
        components: {
            Level1
        }
    })
    export default class App extends Vue {

        @Inject()
        private injectorsRegistry!:InjectorsRegistry;

        @Inject()
        private injector!:Injector;

        mounted() {
            this.injectorsRegistry.register('App', this.injector)
        }
    }
</script>