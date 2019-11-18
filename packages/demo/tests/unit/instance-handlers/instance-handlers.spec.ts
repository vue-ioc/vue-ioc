import {expect} from 'chai';
import {localVue} from '../init-test';
import {mount} from '@vue/test-utils';
import InstanceHandlers from './fixture/component/InstanceHandlers.vue';
import {Reporter} from './fixture/Reporter';
import {$vueIocContainer} from '@vue-ioc/core/src/common/magicFields';

describe('Instance handlers', () => {

    it('should call @PostConstruct, @BeforeDestroy and @CustomInstanceHandler', () => {
        // given
        const wrapper = mount(InstanceHandlers, {
            localVue,
        });
        const reporter = (wrapper.vm as any)[$vueIocContainer].get(Reporter);

        // then
        expect(reporter.lifecycleCalls).to.eql([
            'Reporter.onInit',
            'CustomInstanceHandler.onActivation:Service',
            'Service.onInit',
            'InstanceHandlers.beforeCreate',
            'CustomInstanceHandler.onActivation:VueComponent',
            'InstanceHandlers.onInit',
            'InstanceHandlers.created',
            'InstanceHandlers.mounted',
        ]);

        // when
        reporter.reset();
        wrapper.destroy();

        expect(reporter.lifecycleCalls).to.eql([
            'CustomInstanceHandler.beforeDestroy:VueComponent',
            'Reporter.onDestroy',
            'Service.onDestroy',
            'CustomInstanceHandler.beforeDestroy:Service',
            'InstanceHandlers.onDestroy',
            'InstanceHandlers.beforeDestroy',
        ]);
    });
});
