import Vue from 'vue';
import App from './App.vue';
import {VueIocPlugin} from '@vue-ioc/core';

Vue.config.productionTip = false;
Vue.use(VueIocPlugin);

new Vue({
  render: (h) => h(App),
}).$mount('#app');
