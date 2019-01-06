import {createContainerWithBindings} from '../ContainerService';
import {Container} from 'inversify';
import {LifecycleHandler} from '../lifecycle/LifecycleHandler';

export const VueIocPlugin = {
    install: (Vue) => {
        const reactivityMaker = new Vue({data: {targetObject: {}}});

        Vue.mixin({
            beforeCreate() {
                const parent = findParentContainer(this);
                let $vueIocModuleOptions;
                if (this.$options.$_vueTestUtils_original) {
                    $vueIocModuleOptions = this.$options.$_vueTestUtils_original.prototype.$vueIocModuleOptions;
                } else {
                    $vueIocModuleOptions = this.$vueIocModuleOptions;
                }

                if ($vueIocModuleOptions) {
                    this.$vueIocContainer = createContainerWithBindings({
                        initOnStart: $vueIocModuleOptions.start,
                        parent: $vueIocModuleOptions.parentContainer || parent,
                        providers: $vueIocModuleOptions.providers,
                    });
                } else {
                    this.$vueIocContainer = parent as Container;
                }

                const container = this.$vueIocContainer;
                if (container && this.$options.$vueIocInjections) {
                    for (const propertyKey in this.$options.$vueIocInjections) {
                        if (this.$options.$vueIocInjections.hasOwnProperty(propertyKey)) {
                            const {isArrayType, identifier, reactive} = this.$options.$vueIocInjections[propertyKey];
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
                if (this.$options.$vueIocOnInitMethod) {
                    this[this.$options.$vueIocOnInitMethod]();
                }
            },

            beforeDestroy() {
                if (this.$vueIocContainer) {
                    const lifecycleHandler = this.$vueIocContainer.get(LifecycleHandler) as LifecycleHandler;
                    lifecycleHandler.destroy();
                    this.$vueIocContainer.unbindAll();
                }
                if (this.$options.$vueIocOnDestroyMethod) {
                    this[this.$options.$vueIocOnDestroyMethod]();
                }
            },
        });
    },
};

function findParentContainer(vm): Container | null {
    let $parent = vm;
    const found = false;
    while ($parent && !found) {
        if ($parent.$vueIocContainer) {
            return $parent.$vueIocContainer;
        }
        $parent = $parent.$parent;
    }
    return null;
}
