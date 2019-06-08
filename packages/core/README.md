# vue-ioc
IoC and DI for [Vue](https://vuejs.org/) powered by [InversifyJS](http://inversify.io/)
and inspired by [Angular @Module](https://angular.io/guide/ngmodules) syntactic sugar.

## Required Opinionated Stack
 
 * [Vue](https://vuejs.org) 2.x
 * [vue-class-component](https://github.com/vuejs/vue-class-component)
 * [TypeScript](https://www.typescriptlang.org/) with config flags: `experimentalDecorators: true` and `emitDecoratorMetadata: true`

## Features

 1. **Hierarchical IoC Container** defined in `@Module` by `providers` (using [InversifyJS](http://inversify.io/) under the hood). The hierarchy is bound to Vue components tree.
 2. **Autostart** - instantiating top level services when container has been started (for background tasks similar to `@Effects`  from `ngrx`).
 3. **@InjectReactive()** - makes injected dependency 'deeply reactive' in Vue template.
 4. **Instance Handlers** - `@PostConstruct` and `@BeforeDestroy` - decorators for methods called when instance is created or destroyed by container.

## Planned features (not ready yet)

 5. **State Injectors** for [Vuex](https://vuex.vuejs.org/) and [MobX](https://mobx.js.org/).
 6. **Custom Injectors** ie. `@InjectAcl('CAN_REMOVE')`
 7. **Custom Instance Handlers** ie. `@OnEvent('submitForm')`
 8. **vue-cli** integration

## Caveats / Limitations

 * `@Module` can be bound only to Vue component.
 * You can't use `@Inject()` for Vue component constructor arguments (because you can't define own constructor 
   using `vue-class-component`). Only Vue component class fields are supported.
 
## Installation

`vue-ioc` uses following `peerDependencies`:

 * `inversify`
 * `reflect-metadata`
 * `vue-class-component`
 * `vue`

```bash
# Yarn:
npm install @vue-ioc/core inversify reflect-metadata vue-class-component vue --save

# NPM
yarn add @vue-ioc/core inversify reflect-metadata vue-class-component vue
```

You must explicitly install `vue-ioc` via `Vue.use()` in your app main entrypoint:

```typescript
// main.ts
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
<template>
    <div>
        <HelloWorld/>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {Module} from '@vue-ioc/core';
    import {HttpService} from './services/HttpService';
    import HelloWorld from './components/HelloWorld.vue';
    
    @Module({
        providers: [
            HttpService
        ]
    })
    @Component({
      components: { HelloWorld }
    })
    export default class App extends Vue {
    }
</script>
```
Inject `HttpService` to `<HelloWorld>` component:
```vue
// ./components/HelloWorld.vue
<template>
    <div>
        <h2 v-if="user">Hello {{user.firstName}} {{user.lastName}}!</h2>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {Inject} from '@vue-ioc/core';
    import {HttpService} from '../services/HttpService';

    @Component()
    export default class HelloWorld extends Vue {

        @Inject()
        public httpService: HttpService;
        
        public user = null;

        public async created() {
            this.user =  await this.httpService.get('./hello.json');
        }
    }
</script>
``` 

## Providers

```
@Module({
    providers: [
        // useClass
        { provide: HttpService, useClass: HttpService },
        
        // useClass shortcut 
        HttpService,
        
        // useValue
        { provide: HttpService, useValue: httpService },
        
        // useFactory
        { provide: HttpService, useFactory: (container) => ... }
    ] 
})
``` 