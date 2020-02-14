// Framework Imports
import { BootstrapVue, IconsPlugin } from 'bootstrap-vue';
import PortalVue from 'portal-vue';
import Vue from 'vue';
import VueRouter from 'vue-router';

// Application Imports
import BookNotes from './BookNotes.vue';
import routes from './routes';
import BreadcrumbsMixin from './mixins/breadcrumbsGenerator';
import './assets/theme.scss';

// Configure Framework
Vue.config.productionTip = false;

// Load Framework Plugins
Vue.use(BootstrapVue);
Vue.use(PortalVue);
Vue.use(VueRouter);
Vue.use(IconsPlugin);
Vue.mixin(BreadcrumbsMixin);

// Configure Application
const router = new VueRouter({routes});

// Start Application
new Vue({
    render: h => h(BookNotes),
    router,
}).$mount('#app');
