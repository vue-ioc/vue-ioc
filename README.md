# WARNING - PROJECT UNDER DEVELOPMENT. THERE IS NO LIBRARY PUBLISHED RIGHT NOW!


# vue-ioc
IoC and DI for [Vue](https://vuejs.org/) powered by [InversifyJS](http://inversify.io/)
and inspired by [Angular @Module](https://angular.io/guide/ngmodules) syntactic sugar.

## Required Opinionated Stack
 
 * [Vue](https://vuejs.org) 2.x
 * [vue-class-component](https://github.com/vuejs/vue-class-component)
 * [TypeScript](https://www.typescriptlang.org/) with config flags: `experimentalDecorators: true` and `emitDecoratorMetadata: true`

## Features

 1. **Hierarchical IoC Container** defined in `@Module` by `providers` (using [InversifyJS](http://inversify.io/) under the hood). The hierarchy is bound to Vue components tree.
 2. **Injectors**
      * `@Inject()` for regular services. Can be used either for **constructor arguments** either for **class properties**. 
      * `@InjectReactive()` for objects injected by `Vue.set(...)` to be tracked by Vue as reactive structures.
 3. **Instance Handlers** - `@OnInit` and `@onDestroy` - decorators for methods called when instance is created or destroyed by container.
 4. **Autostart** - instantiating top level services when container has been started (for background tasks similar to `@Effects`  from `ngrx`). 
 5. **State Injectors** for [Vuex](https://vuex.vuejs.org/) and [MobX](https://mobx.js.org/).
 6. **Custom Injectors** ie. `@InjectAcl('CAN_REMOVE')`
 7. **Custom Instance Handlers** ie. `@onEventBus('submitForm')`

## Caveats / Limitations

 * `@Module` can be bound only to Vue component.
 * You can't use `@Inject()` for Vue component constructor arguments (because you can't define own constructor 
   using `vue-class-component`). Only Vue component class fields are supported.
 
## Installation

*  You can install by Vue CLI...
```bash
vue add ioc
```

 * ... or by NPM/Yarn
```bash
# Yarn:
npm install @vue-ioc/core --save

# NPM
yarn add @vue-ioc/core
```

You must explicitly install `vue-ioc` via `Vue.use()` in your app entrypoint:

```typescript
import Vue from 'vue'
import {VueIocPlugin} from '@vue-ioc/core' 

Vue.use(VueIocPlugin)
``` 

## Quick Start

Create simple injectable service `HttpService`:

```typescript
// ./services/HttpService.ts
import {Injectable} from '@vue-ioc/core';

@Injectable()
export class HttpService {
    public get(url: string): Promise<any> {
        return fetch(url).then(rs => rs.json());
    }
}
```  

Add root container using `@Module` decorator at your top level App component and setup providers:

```vue
// App.vue
<script lang="ts">
    import {Module} from '@vue-ioc/core';
    import {Component, Vue} from 'vue-class-component';
    import {HttpService} from './services/HttpService';
    import HelloWorld from './components/HelloWorld.vue';
    
    @Module({
        providers: [
            HttpService,
        ]
    })
    @Component({
      components: { HelloWorld }
    })
    export default class App extends Vue {
    }
</script>
<template>
    <div>
        <HelloWorld/>
    </div>
</template>
```
Inject `HttpService` to `<HelloWorld>` component:
```vue
// ./components/HelloWorld.vue
<script lang="ts">
    import {Inject} from '@vue-ioc/core';
    import {Component, Vue} from 'vue-class-component';
    import {HttpService} from '../services/HttpService';

    @Component()
    export default class HelloWorld extends Vue {

        @Inject()
        public httpService: HttpService;

        public async created() {
            const response = await this.httpService.get('./hello.json')
            console.log('Hello vue-ioc', response);
        }
    }
</script>

``` 
