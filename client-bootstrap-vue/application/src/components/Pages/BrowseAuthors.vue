<template><div id="authors-browse">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <PageError  v-if="displayError" :errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-row v-if="displayPage"></b-row>
    <b-row v-if="displayPage">
        <b-col class="pr-2">
            <SidebarFacetsPanel class="mr-2" :sidebarFacets="facetOptions" :sidebarFacetDataset="authors" v-on:resultsUpdated="updateAuthorsOnPage" />
        </b-col>
        <b-col cols="9" class="px-0 mr-3">
            <div class="h6 ml-1 text-dark">Displaying {{ authorsOnPage.length }} author{{ (authorsOnPage.length == 1 ? '' : 's') }}</div>
            <b-list-group>
                <b-list-group-item v-bind:variant="author.deleted_at ? 'light' : ''" v-for="author in authorsOnPage" v-bind:key="author.id" v-bind:to="{ path: 'author/' + author.id }" class="d-flex justify-content-between align-items-center">
                    <span>{{ getAuthorNameLastFirstMiddle(author) }}</span>
                    <span>
                        <b-badge pill class="artist-badge text-light ml-1" variant="tags" v-for="tag in author.Tags" v-bind:key="tag.id" v-bind:to="'/tag/' + tag.id">{{ tag.tag }}</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="info" v-if="author.bookCount">{{ author.bookCount + (author.bookCount > 1 ? ' books' : ' book') }}</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="pseudonym" v-if="author.parent_author_id">Pseudonym</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="danger" v-if="author.deleted_at">Deleted</b-badge>
                    </span>
                </b-list-group-item>
            </b-list-group>
        </b-col>
    </b-row>
</div></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import authorHelpers from '../Mixins/authorHelpers';
import facetHelpers from '../Mixins/facetHelpers';
import pageHelpers from '../Mixins/pageHelpers';
import axios from 'axios';
import SidebarFacetsPanel from '../PageElements/SidebarFacetsPanel.vue';
export default {
    name: "BrowseAuthors",
    components: { SidebarFacetsPanel },
    data: function() {return {
        authors: [],
        authorsOnPage: [],
        facetOptions: [
            this.getCheckboxFacetItem('Show Deleted', this.defaultFilterUnchecked, this.filterDeletedAuthors),
            this.getCheckboxFacetItem('Show Pseudonyms', this.defaultFilterUnchecked, this.filterPseudonymAuthors),
        ],
    };},
    methods: {
        defaultAuthorDisplay: function() {
            this.authorsOnPage = this.authors.filter(this.filterPseudonymAuthors).filter(this.filterDeletedAuthors);
        },
        updateAuthorsOnPage: function(authorsToShow) {
            this.authorsOnPage = authorsToShow;
        },
    },
	mixins: [apiResultsHelpers, authorHelpers, facetHelpers, pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getAuthorBrowseBreadcrumb(true)]);
        axios.get('/authors').then(response => {
            this.authors = response.data.Authors;
            this.defaultAuthorDisplay();
            this.transitionFromLoadingToPage();
        }).catch(() => {
            this.transitionFromLoadingToError('Could not retrieve authors.');
        });
    },
};
</script>

<style>
#authors-browse .list-group .list-group-item {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
}
#authors-browse .list-group .list-group-item .artist-badge {
    font-size: 0.6rem;
    vertical-align: middle;
}
</style>