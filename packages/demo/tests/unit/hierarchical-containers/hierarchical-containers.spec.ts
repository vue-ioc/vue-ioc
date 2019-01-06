import {expect} from 'chai';
import {localVue} from '../init-test';
import {mount} from '@vue/test-utils';
import App from '../../../src/App.vue';
import * as fetchMock from 'fetch-mock';

describe('Hierarchical containers', () => {
    it('should create hierarchical containers', (done) => {
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
