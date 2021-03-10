import Vue from 'vue'
import App from './App.vue'
import axios from 'axios';
import vueCookies from 'vue-cookies'
import 'font-awesome/css/font-awesome.css';
import 'bootstrap/dist/css/bootstrap.css';
import 'amis/lib/themes/default.css';
import 'amis/lib/helper.css';

Vue.config.productionTip = false
Vue.prototype.$ajax = axios;
Vue.use(vueCookies);

new Vue({
  render: h => h(App),
}).$mount('#app')
