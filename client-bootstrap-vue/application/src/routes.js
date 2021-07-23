import BrowseAuthors from './components/Pages/BrowseAuthors.vue';
import CreateAuthorPage from './components/Pages/CreateAuthorPage.vue';
import ViewAuthor from './components/Pages/ViewAuthor.vue';

import BrowseBooks from './components/Pages/BrowseBooks.vue';
import CreateBookPage from './components/Pages/CreateBookPage.vue';
import ViewBook from './components/Pages/ViewBook.vue';

import BrowseTags from './components/Pages/BrowseTags.vue';
import CreateTagPage from './components/Pages/CreateTagPage.vue';
import ViewTag from './components/Pages/ViewTag.vue';

import Dashboard from './components/Pages/Dashboard.vue';

const routes = [{
    path: '/',
    component: Dashboard,
},{
    path: '/authors',
    component: BrowseAuthors,
},{
    path: '/make/authors',
    component: CreateAuthorPage,
},{
    path: '/author',
    redirect: '/authors',
},{
    path: '/author/:authorId',
    component: ViewAuthor,
    props: true,
},{
    path: '/books',
    component: BrowseBooks,
},{
    path: '/make/books',
    component: CreateBookPage,
},{
    path: '/book',
    redirect: '/books',
},{
    path: '/book/:bookId',
    component: ViewBook,
    props: true,
},{
    path: '/tags',
    component: BrowseTags,
},{
    path: '/make/tags',
    component: CreateTagPage,
},{
    path: '/tag',
    redirect: '/tags',
},{
    path: '/tag/:tagId',
    component: ViewTag,
    props: true,
}];

export default routes;