<template><div id="books-browse">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <PageError  v-if="displayError" :errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-row v-if="displayPage">

        <!-- Temporarily Hide Sidebar
        <b-col class="pr-2">
            SidebarFacets Goes Here
        </b-col>
        <b-col cols="9" class="px-0 mr-3">
        -->

        <b-col class="mx-0">
            <b-list-group>
                <b-list-group-item v-bind:variant="book.deleted_at ? 'light' : ''" v-for="book in booksOnPage" v-bind:key="book.id" v-bind:to="{ path: 'book/' + book.id }" class="d-flex justify-content-between align-items-center">
                    {{ book.title }}
                    <span>
                        <b-badge pill class="artist-badge text-light ml-1" variant="tags" v-for="tag in book.Tags" v-bind:key="tag.id" v-bind:to="'/tag/' + tag.id">{{ tag.tag }}</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="danger" v-if="book.deleted_at">Deleted</b-badge>
                    </span>
                </b-list-group-item>
            </b-list-group>
        </b-col>
    </b-row>
</div></template>

<script>
import pageHelpers from '../Mixins/pageHelpers';
import axios from 'axios';
export default {
    data: function() { return {
        books: [],
        booksOnPage: [],
    }; },
    name: "BrowseBooks",
	mixins: [pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getBookBrowseBreadcrumb(true)]);
        axios.get('/books').then(response => {
            this.books = response.data.Books;
            this.booksOnPage = this.books;

            /* eslint no-console: ["error", { allow: ["log"] }] */
            console.log('Browse Books:', this.books);

            // this.defaultAuthorDisplay();
            this.transitionFromLoadingToPage();
        }).catch(() => {
            this.transitionFromLoadingToError('Could not retrieve books.');
        });
    },
}
</script>

<style>
#books-browse .list-group .list-group-item {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
}
#books-browse .list-group .list-group-item .artist-badge {
    font-size: 0.6rem;
    vertical-align: middle;
}
</style>