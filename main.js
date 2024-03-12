import App from './App'
import store from './store';
import uView from 'uview-ui';
import api from 'common/api.js';
import util from 'common/util.js';
import md5 from 'js-md5';

// #ifndef VUE3
import Vue from 'vue'

Vue.use(uView);
Vue.config.productionTip = false
Vue.prototype.$store = store;
Vue.prototype.$api = api;
Vue.prototype.$util = util;
Vue.prototype.$md5 = md5;
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif