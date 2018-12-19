import {createContainerWithBindings} from '../ContainerService';
import {Container} from 'inversify';

export const VueIocPlugin = {
    install: (Vue) => {
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

                if (this.$vueIocContainer && this.$options.$vueIocInjections) {
                    for (const propertyKey in this.$options.$vueIocInjections) {
                        if (this.$options.$vueIocInjections.hasOwnProperty(propertyKey)) {
                            const {isArrayType, identifier} = this.$options.$vueIocInjections[propertyKey];
                            if (isArrayType) {
                                (this as any)[propertyKey] = this.$vueIocContainer.getAll(identifier);
                            } else {
                                (this as any)[propertyKey] = this.$vueIocContainer.get(identifier);
                            }
                        }
                    }
                }
            },
            destroyed() {
                if (this.$vueIocContainer) {
                    this.$vueIocContainer.unbindAll();
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
