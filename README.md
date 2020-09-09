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
 5. **Custom Instance Handlers** ie. `@OnEvent('submitForm')`
 6. **providedIn 'root' or 'self'** - select where will be bound @Injectable (friendly for tree shakeable singletons and lazy loaded @Modules) 

## Planned features (not ready yet)
 7. **State Injectors** for [Vuex](https://vuex.vuejs.org/) and [MobX](https://mobx.js.org/).
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

# NPM
npm install @vue-ioc/core inversify reflect-metadata vue-class-component vue --save

# Yarn
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

[![Edit vue-ioc basic example](https://codesandbox.io/static/img/play-codesandbox.svg)](https://codesandbox.io/s/k28n6rp36v?fontsize=14)

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

```typescript
@Module({
    providers: [
        // useClass
        { provide: HttpService, useClass: HttpService },
        
        // useClass shortcut 
        HttpService,
        
        // useValue
        { provide: HttpService, useValue: httpService },
        
        // useFactory
        { provide: HttpService, useFactory: (injector) => /* ...injector.get(FooService)... */ }
    ] 
})
``` 

## providedIn

Default value: `'self'` Available values: `'root', 'self'`

`@Injectable( { providedIn: 'root' } )` will bind service in root (App) container always as singleton.

You may also override this setting at `@Module` providers level in both directions:

```typescript
@Module({
    providers: [
        { provide: HttpService, useClass: HttpService, providedIn: 'root' },   // overrides @Injectable()
        { provide: OtherService, useClass: OtherService, providedIn: 'self' }, // overrides @Injectable( {providedIn: 'root'} )
    ] 
})
```

## Custom Instance Handlers

`@PostConstruct()` and `@BeforeDestroy()` are two built in instance listeners. You may create custom instance handlers
like `@OnEvent('submitForm')` by creating a decorator using `createInstanceHandlerDecorator`

1. Prepare the most basic EventBus implementation:
```typescript
// bus/EventBus.ts
import Vue from 'vue';
import {Injectable} from '@vue-ioc/core';

@Injectable()
export class EventBus {

    private bus: Vue = new Vue();

    dispatch(name: string, data: any) {
        this.bus.$emit(name, data);
    }

    addListener(name: string, listener: (data: any) => void) {
        this.bus.$on(name, listener)
    }

    removeListener(name: string, listener: (data: any) => void) {
        this.bus.$off(name, listener)
    }
}

```

2. Create `@OnEvent(name:string)` decorator

```typescript
// bus/OnEvent.ts
import {createInstanceHandlerDecorator} from '@vue-ioc/core';
import {EventBus} from './EventBus';

export function OnEvent(name: string) {
    return createInstanceHandlerDecorator(({injector, instance, method}) => {
        // attach handler - a place where listeners should be attached
        const bus: EventBus = injector.get(EventBus); // you have access to injector where all services can be retrieved
        const boundMethod = instance[method].bind(instance); // bound method to `this` of instance
        bus.addListener(name, boundMethod);
        return () => { 
            // detach handler - a place where all listeners should be detached
            bus.removeListener(name, boundMethod);
        };
    });
}
```

3. Dispatch event from view:

```typescript
// view/Form.vue
<template>
    <div>
        <button @click="submitForm">Submit</button>
    </div>
</template>
<script lang="ts">
    import Vue from 'vue'
    import Component from 'vue-class-component'
    import {Inject} from '@vue-ioc/core';
    import {EventBus} from '../bus/EventBus';

    @Component()
    export default class SomeForm extends Vue {

        @Inject()
        public bus!: EventBus;

        public submitForm() {
            this.bus.dispatch('submitForm', { firstName: 'John', lastName: 'Doe'})
        }
    }
</script>
```
4. Handle event in external action:

```typescript
// actions/SubmitForm.ts
import {OnEvent} from '../bus/OnEvent'
import {Injectable} from '@vue-ioc/core';

@Injectable()
export class SubmitForm {
  
  @OnEvent('submitForm')
  perform (data) {
     // do something with data
  }
}
```

## Inversify Container Options

vue-ioc uses following default options for creating Inversify containers: 

    {
        autoBindInjectable: false,
        defaultScope: 'Singleton',
        skipBaseClassChecks: true,
    }
    
To override or add other options, please use `containerOptions` of plugin options:

```typescript
Vue.use(VueIocPlugin, {
  containerOptions: {
    // options of Inversify container:
    // https://github.com/inversify/InversifyJS/blob/master/wiki/container_api.md#container-options
  }
})
```