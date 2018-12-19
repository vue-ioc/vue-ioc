import {expect} from 'chai';
import {config, createLocalVue, mount} from '@vue/test-utils';
import App from '@/App.vue';
import {VueIocPlugin} from '@vue-ioc/core';
import * as fetchMock from 'fetch-mock';

config.logModifiedComponents = false;

const localVue = createLocalVue();
localVue.use(VueIocPlugin);

describe('App.vue', () => {
    it('should render user name', (done) => {
        // given
        fetchMock.get('*', {firstName: 'Monica', lastName: 'Geller'});

        // when
        // @ts-ignore
        const wrapper = mount(App, {localVue});

        setTimeout(() => {
            // then
            expect(wrapper.text()).to.include('Hello Monica Geller!');

            fetchMock.reset();
            done();
        }, 0);
    });
});
