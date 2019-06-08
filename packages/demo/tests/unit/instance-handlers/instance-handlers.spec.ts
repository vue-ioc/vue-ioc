import {expect} from 'chai';
import {localVue} from '../init-test';
import {mount} from '@vue/test-utils';
import InstanceHandlers from './fixture/component/InstanceHandlers.vue';
import {Reporter} from './fixture/Reporter';

describe('Instance handlers', () => {

    it('should call @PostConstruct and @BeforeDestroy', () => {
        // given
        const wrapper = mount(InstanceHandlers, {
            localVue,
        });
        const reporter = (wrapper.vm as any).$vueIocContainer.get(Reporter);

        // then
        expect(reporter.lifecycleCalls).to.eql([
            'Reporter.onInit',
            'Service.onInit',
            'InstanceHandlers.beforeCreate',
            'InstanceHandlers.onInit',
            'InstanceHandlers.created',
            'InstanceHandlers.mounted',
        ]);

        // when
        reporter.reset();
        wrapper.destroy();

        expect(reporter.lifecycleCalls).to.eql([
            'Reporter.onDestroy',
            'Service.onDestroy',
            'InstanceHandlers.onDestroy',
            'InstanceHandlers.beforeDestroy',
        ]);

    });
});
