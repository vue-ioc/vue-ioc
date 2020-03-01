import {expect} from 'chai';
import {localVue} from '../init-test';
import {mount} from '@vue/test-utils';
import App from './fixture/App.vue';
import {$vueIocContainer} from '../../../../core/src/common/magicFields';
import {InjectorsRegistry} from './fixture/InjectorsRegistry';
import {ProvidedInRootService} from './fixture/ProvidedInRootService';
import {OverriddenProvidedInService} from './fixture/OverriddenProvidedInService';

describe('providedIn', () => {
    it('should bind services in correct levels', () => {
        // given
        // @ts-ignore
        const wrapper = mount(App, {localVue});

        const injectorsRegistry: InjectorsRegistry = (wrapper.vm as any)[$vueIocContainer].get(InjectorsRegistry);

        // when
        const appInjector = injectorsRegistry.getInjector('App');
        const level1Injector = injectorsRegistry.getInjector('Level1');
        const level2Injector = injectorsRegistry.getInjector('Level2');

        // then
        expect(appInjector).to.not.equal(level1Injector);
        expect(appInjector).to.not.equal(level2Injector);
        expect(level1Injector).to.not.equal(level2Injector);

        // when
        const providedInRootAtApp = appInjector.get(ProvidedInRootService);
        const providedInRootAtLevel1 = level1Injector.get(ProvidedInRootService);
        const providedInRootAtLevel2 = level2Injector.get(ProvidedInRootService);

        // then
        expect(providedInRootAtApp).is.not.null;
        expect(providedInRootAtLevel1).is.not.null;
        expect(providedInRootAtLevel2).is.not.null;
        expect(providedInRootAtApp === providedInRootAtLevel1).is.true;
        expect(providedInRootAtLevel1 === providedInRootAtLevel2).is.true;
        expect(providedInRootAtApp).is.instanceOf(ProvidedInRootService);

        // when
        const overriddenProvidedInServiceAtApp = appInjector.get(OverriddenProvidedInService);
        const overriddenProvidedInServiceAtLevel1 = level1Injector.get(OverriddenProvidedInService);
        const overriddenProvidedInServiceAtLevel2 = level2Injector.get(OverriddenProvidedInService);

        // then
        expect(overriddenProvidedInServiceAtApp === overriddenProvidedInServiceAtLevel1).is.true;
        expect(overriddenProvidedInServiceAtLevel1 === overriddenProvidedInServiceAtLevel2).is.true;
        expect(overriddenProvidedInServiceAtApp).is.instanceOf(OverriddenProvidedInService);

        // when
        const overriddenToSelfAtLevel2 = level2Injector.get<ProvidedInRootService>('root_overridden_in_self');

        // then
        expect(overriddenToSelfAtLevel2).is.instanceOf(ProvidedInRootService);
        expect(() => {
            appInjector.get('root_overridden_in_self');
        }).to.throw('No matching bindings found for serviceIdentifier: root_overridden_in_self');
        expect(() => {
            level1Injector.get('root_overridden_in_self');
        }).to.throw('No matching bindings found for serviceIdentifier: root_overridden_in_self');
    });
});
