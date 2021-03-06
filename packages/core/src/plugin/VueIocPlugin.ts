import {createContainerWithBindings} from '../ContainerService';
import {Container, interfaces} from 'inversify';
import {LifecycleHandler} from '../lifecycle/LifecycleHandler';
import {
    $_vueTestUtils_original,
    $vueIocContainer,
    $vueIocCustomInstanceListeners,
    $vueIocInjections,
    $vueIocInstanceListenerMethods,
    $vueIocModuleOptions,
    $vueIocOnDestroyMethod,
    $vueIocOnInitMethod,
} from '../common/magicFields';
import {Injector} from '..';
import ContainerOptions = interfaces.ContainerOptions;

export type VueIocPluginOptions = { containerOptions?: ContainerOptions };

export const VueIocPlugin = {
    install: (Vue, {containerOptions}: VueIocPluginOptions = {}) => {
        const reactivityMaker = new Vue({data: {targetObject: {}}});

        Vue.mixin({
            beforeCreate() {
                const $options = this.$options;
                const parent = findParentContainer(this);
                const $moduleOptions = getModuleOptions(this);

                if ($moduleOptions) {
                    this[$vueIocContainer] = createContainerWithBindings({
                        initOnStart: $moduleOptions.start,
                        parent: $moduleOptions.parentContainer || parent,
                        providers: $moduleOptions.providers,
                        vm: this,
                        containerOptions,
                    });
                } else {
                    this[$vueIocContainer] = parent as Container;
                }

                const container = this[$vueIocContainer];
                if (container && $options[$vueIocInjections]) {
                    for (const propertyKey in $options[$vueIocInjections]) {
                        if ($options[$vueIocInjections].hasOwnProperty(propertyKey)) {
                            const {isArrayType, identifier, reactive} = $options[$vueIocInjections][propertyKey];
                            const value = isArrayType ? container.getAll(identifier) : container.get(identifier);
                            if (reactive) {
                                reactivityMaker.targetObject = value;
                            }
                            this[propertyKey] = value;
                        }
                    }
                }
            },

            created() {
                const $options = this.$options;
                if ($options[$vueIocInstanceListenerMethods]) {
                    this[$vueIocCustomInstanceListeners] = $options[$vueIocInstanceListenerMethods].map(({method, handler}) => {
                        return handler({instance: this, method, injector: this[$vueIocContainer].get(Injector)});
                    });
                }
                if ($options[$vueIocOnInitMethod]) {
                    this[$options[$vueIocOnInitMethod]]();
                }
            },

            beforeDestroy() {
                const customInstanceListeners = this[$vueIocCustomInstanceListeners];
                if (customInstanceListeners) {
                    customInstanceListeners.forEach((destroyHandler) => {
                        destroyHandler && destroyHandler();
                    });
                }

                const hasModuleOptions = !!getModuleOptions(this);
                if (hasModuleOptions) {
                    const container = this[$vueIocContainer];
                    const lifecycleHandler = container.get(LifecycleHandler) as LifecycleHandler;
                    lifecycleHandler.destroy();
                    container.unbindAll();
                }

                const $options = this.$options;
                if ($options[$vueIocOnDestroyMethod]) {
                    this[$options[$vueIocOnDestroyMethod]]();
                }
            },
        });
    },
};

function findParentContainer(vm): Container | null {
    let $parent = vm;
    const found = false;
    while ($parent && !found) {
        if ($parent[$vueIocContainer]) {
            return $parent[$vueIocContainer];
        }
        $parent = $parent.$parent;
    }
    return null;
}

function getModuleOptions(vm) {
    const $options = vm.$options;
    if ($options[$_vueTestUtils_original]) {
        return $options[$_vueTestUtils_original].prototype[$vueIocModuleOptions];
    } else {
        return vm[$vueIocModuleOptions];
    }
}