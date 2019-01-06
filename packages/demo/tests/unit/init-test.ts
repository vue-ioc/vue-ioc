import {config, createLocalVue} from '@vue/test-utils';
import {VueIocPlugin} from '@vue-ioc/core';

config.logModifiedComponents = false;

export const localVue = createLocalVue();
localVue.use(VueIocPlugin);
