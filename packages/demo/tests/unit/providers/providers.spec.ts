import {expect} from 'chai';
import {localVue} from '../init-test';
import {mount} from '@vue/test-utils';
import App from './fixture/App.vue';
import {$vueIocContainer} from '../../../../core/src/common/magicFields';
import {FooService} from './fixture/FooService';
import {BAR_VALUE_TOKEN, FACTORY_FUNCTION_SERVICE_TOKEN, FOO_SERVICE_TOKEN} from './fixture/container-tokens';

describe('Providers', () => {
    it('should provide services via useClass, useFactory and useValue', () => {
        // given
        // @ts-ignore
        const wrapper = mount(App, {localVue});

        // when
        const injector = (wrapper.vm as any)[$vueIocContainer];
        const fooService = injector.get(FOO_SERVICE_TOKEN);
        const factoryFunctionService = injector.get(FACTORY_FUNCTION_SERVICE_TOKEN);
        const barValue = injector.get(BAR_VALUE_TOKEN);

        // then
        expect(fooService).is.instanceOf(FooService);
        expect(factoryFunctionService.fooService).is.equal(fooService);
        expect(barValue).is.equal('BAR_VALUE')
    });
});
