<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <HelloWorld/>
        <ReactiveInjection/>
        <p>
            <button @click="toggleDumbComponent">Toggle Dumb Component</button>
        </p>
        <dumb-component v-if="dumbComponentVisible"/>
    </div>
</template>
<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {Module} from '@vue-ioc/core';
import HelloWorld from './components/HelloWorld.vue';
import {HttpService} from './services/HttpService';
import ReactiveInjection from '../tests/unit/reactive-injection/fixture/component/ReactiveInjection.vue';
import {EventBus} from '@/bus/EventBus';
import DumbComponent from '@/components/DumbComponent.vue';

@Module({
    providers: [
        EventBus,
        HttpService,
    ],
})
@Component({
    components: {
        HelloWorld,
        ReactiveInjection,
        DumbComponent,
    },
})
export default class App extends Vue {

    private dumbComponentVisible: boolean = true;

    public toggleDumbComponent() {
        this.dumbComponentVisible = !this.dumbComponentVisible;
    }
}
</script>


<style>
    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        text-align: center;
        color: #2c3e50;
        margin-top: 60px;
    }
</style>
