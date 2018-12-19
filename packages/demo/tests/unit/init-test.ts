import {config, createLocalVue} from '@vue/test-utils';
import {VueIocPlugin} from '@vue-ioc/core';

config.logModifiedComponents = false;

const _localVue = createLocalVue();
_localVue.use(VueIocPlugin);

export const localVue = _localVue