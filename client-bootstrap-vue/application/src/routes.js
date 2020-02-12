import BrowseAuthors from './components/BrowseAuthors.vue';
import ViewAuthor from './components/ViewAuthor.vue';
import Dashboard from './components/Dashboard.vue';

const routes = [{
    path: '/',
    component: Dashboard,
},{
    path: '/authors',
    component: BrowseAuthors,
},{
    path: '/author/:authorId',
    component: ViewAuthor,
    props: true,
}];

export default routes;