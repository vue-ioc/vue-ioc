<template>
    <div>
        <h2 v-if="user">Hello {{user.firstName}} {{user.lastName}}!</h2>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {Inject, Module} from '@vue-ioc/core';
    import {UserService} from '../services/UserService';

    @Module({
        providers: [
            UserService
        ]
    })
    @Component
    export default class HelloWorld extends Vue {

        @Inject()
        public userService: UserService;

        user = null;

        public async created() {
            this.user = await this.userService.getUser();
        }
    }
</script>