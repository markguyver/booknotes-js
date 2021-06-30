<template><div id="books-browse">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <PageError  v-if="displayError" :errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-row v-if="displayPage">
        <b-col class="pr-2">
            <SidebarFacetsPanel class="mr-2" :sidebarFacets="facetOptions" :sidebarFacetDataset="books" v-on:resultsUpdated="updateBooksOnPage" />
        </b-col>
        <b-col cols="9" class="px-0 mr-3">
            <div class="h6 ml-1 text-dark">Displaying {{ booksOnPage.length }} book{{ (booksOnPage.length == 1 ? '' : 's') }}</div>
            <b-list-group>
                <b-list-group-item v-bind:variant="book.deleted_at ? 'light' : ''" v-for="book in booksOnPage" v-bind:key="book.id" v-bind:to="{ path: 'book/' + book.id }" class="d-flex justify-content-between align-items-center">
                    {{ book.title }}
                    <span>
                        <b-badge pill class="artist-badge text-light ml-1" variant="tags" v-for="tag in book.Tags" v-bind:key="tag.id" v-bind:to="'/tag/' + tag.id">{{ tag.tag }}</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="info" v-if="book.noteCount">{{ book.noteCount + (book.noteCount > 1 ? ' notes' : ' note') }}</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="danger" v-if="book.deleted_at">Deleted</b-badge>
                    </span>
                </b-list-group-item>
            </b-list-group>
        </b-col>
    </b-row>
</div></template>

<script>
import bookHelpers from '../Mixins/bookHelpers';
import facetHelpers from '../Mixins/facetHelpers';
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
import SidebarFacetsPanel from '../PageElements/SidebarFacetsPanel.vue';
export default {
    name: "BrowseBooks",
    components: { SidebarFacetsPanel },
    data: function() { return {
        books: [],
        booksOnPage: [],
        facetOptions: [
            this.getCheckboxFacetItem('Show Deleted', this.showDeletedBooks, this.filterDeletedBooks),
        ],
    }; },
    methods: {
        updateBooksOnPage: function(booksToShow) {
            this.booksOnPage = booksToShow;
        },
    },
	mixins: [bookHelpers, facetHelpers, apiResultsHelpers, pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getBookBrowseBreadcrumb(true)]);
        this.getAllBooks().then(bookList => {
            // this.books = bookList;
            this.books = bookList.map(currentBook => currentBook.toJSON()).toJSON(); // TODO: Temporarily Convert ImmutableObjects to JS
            this.transitionFromLoadingToPage();
        }).catch(() => this.transitionFromLoadingToError('Could not retrieve books.'));
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