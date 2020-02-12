// Framework Imports
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

// Application Imports
import routes from './routes';
import BookNotes from './BookNotes.vue';
import 'bootstrap/dist/css/bootstrap.css';

// Configure Framework
Vue.config.productionTip = false;

// Load Framework Plugins
Vue.use(BootstrapVue);
Vue.use(PortalVue);
Vue.use(VueRouter);
Vue.use(IconsPlugin);

// Configure Application
const router = new VueRouter({routes});

// Start Application
new Vue({
    render: h => h(BookNotes),
    router,
}).$mount('#app');
