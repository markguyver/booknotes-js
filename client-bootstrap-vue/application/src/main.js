import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import VueRouter from 'vue-router';
import BookNotes from './BookNotes.vue';
import Dashboard from './components/Dashboard.vue'

import 'bootstrap/dist/css/bootstrap.css';

Vue.config.productionTip = false;

Vue.use(BootstrapVue);
Vue.use(PortalVue);
Vue.use(VueRouter);
Vue.use(IconsPlugin);

const router = new VueRouter([{
    name: 'Dashboard',
    path: '/',
    component: Dashboard,
}]);

new Vue({
    render: h => h(BookNotes),
    router,
}).$mount('#app');
