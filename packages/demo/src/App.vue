<template>
    <div id="app">
        <img alt="Vue logo" src="./assets/logo.png">
        <HelloWorld/>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {Module} from '@vue-ioc/core';
    import HelloWorld from './components/HelloWorld.vue';
    import {HttpService} from './services/HttpService';

    @Module({
        providers: [
            HttpService,
        ]
    })
    @Component({
        components: {
            HelloWorld,
        },
    })
    export default class App extends Vue {
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
