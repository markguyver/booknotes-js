import BrowseAuthors from './components/Pages/BrowseAuthors.vue';
import CreateAuthors from './components/Pages/CreateAuthors.vue';
import ViewAuthor from './components/Pages/ViewAuthor.vue';
import BrowseBooks from './components/Pages/BrowseBooks.vue';
import ViewBook from './components/Pages/ViewBook.vue';
import BrowseTags from './components/Pages/BrowseTags.vue';
import Dashboard from './components/Pages/Dashboard.vue';

const routes = [{
    path: '/',
    component: Dashboard,
},{
    path: '/authors',
    component: BrowseAuthors,
},{
    path: '/make/authors',
    component: CreateAuthors,
},{
    path: '/author/:authorId',
    component: ViewAuthor,
    props: true,
},{
    path: '/books',
    component: BrowseBooks,
},{
    path: '/book/:bookId',
    component: ViewBook,
    props: true,
},{
    path: '/tags',
    component: BrowseTags,
}];

export default routes;