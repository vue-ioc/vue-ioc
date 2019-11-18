<template>
    <div>
        <div v-if="userState.isLoading">Loading, please wait...</div>
        <h2 v-else>Hello {{userState.firstName}} {{userState.lastName}}!</h2>
        <p>
            <button @click="changeLastName">Change last name to 'Walker'</button>
        </p>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue';
    import Component from 'vue-class-component';
    import {Inject, InjectReactive, Module} from '@vue-ioc/core';
    import {EventBus} from '@/bus/EventBus';
    import {UserService} from '@/services/UserService';
    import {UserState} from '@/state/UserState';
    import {LoadUser} from '@/actions/LoadUser';
    import {ChangeLastName} from '@/actions/ChangeLastName';

    @Module({
        providers: [
            UserState,
            UserService,
            LoadUser,
            ChangeLastName,
        ],
        start: [
            LoadUser,
            ChangeLastName
        ]
    })
    @Component
    export default class HelloWorld extends Vue {

        @Inject()
        public userService!: UserService;

        @Inject()
        public bus!: EventBus;

        @InjectReactive()
        public userState!: UserState;

        public changeLastName() {
            this.bus.dispatch('changeLastName', 'Walker');
        }
    }
</script>
