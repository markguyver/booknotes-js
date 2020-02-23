<template><div id="authors-browse">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <div class="mx-auto">{{ errorMessage }}</div>
        </b-col>
    </b-row>
    <b-row v-if="displayAuthors">
        <b-col class="pr-2">
            <SidebarFacets class="mr-2" :sidebarFacets="facetOptions" :sidebarFacetDataset="authors" v-on:resultsUpdated="updateAuthorsOnPage" />
        </b-col>
        <b-col cols="9" class="px-0 mr-3">
            <b-list-group>
                <b-list-group-item v-bind:variant="author.deleted_at ? 'light' : ''" v-for="author in authorsOnPage" v-bind:key="author.id" v-bind:to="{ path: 'author/' + author.id }" class="d-flex justify-content-between align-items-center">
                    {{ displayAuthorNameLastFirst(author) }}
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
import axios from 'axios';
import Loading from '../PageElements/Loading.vue';
import SidebarFacets from '../PageElements/SidebarFacets.vue';

const removePenNamesFilter = author => (!author.parent_author_id);
const removeSoftDeletedAuthors = author => !author.deleted_at;

export default {
    name: "BrowseAuthors",
    components: {
        Loading,
        SidebarFacets,
    },
    data: function() {return {
        authors: [],
        authorsOnPage: [],
        displayAuthors: false,
        displayError: false,
        displayLoading: true,
        errorMessage: '',
        breadcrumbs: [{
            text: 'Home',
            to: '/',
        },{
            text: 'Browse Authors',
            active: true,
        }],
        facetOptions: [{
            label: 'Show Deleted',
            type: 'checkbox',
            filter: author => !author.deleted_at,
            checked: false,
        },{
            label: 'Show Pseudonyms',
            type: 'checkbox',
            filter: author => !author.parent_author_id,
            checked: false,
        }],
    };},
    methods: {
        displayAuthorNameLastFirst: author => author.last_name + (author.first_name ? ', ' + author.first_name + (author.middle_name ? ' ' + author.middle_name : '') : ''),
        defaultAuthorDisplay: function() {
            this.authorsOnPage = this.authors.filter(removePenNamesFilter).filter(removeSoftDeletedAuthors);
        },
        updateAuthorsOnPage: function(authorsToShow) {
            this.authorsOnPage = authorsToShow;
        },
    },
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getAuthorBrowseBreadcrumb(true)]);
        axios.get('/authors').then(response => {
            this.authors = response.data.Authors;
            this.defaultAuthorDisplay();
            this.displayLoading = false;
            this.displayAuthors = true;
        }).catch(error => {
            this.$bvToast.toast('Could not retrieve authors.', {
                title: 'Retrieval Error',
                variant: 'danger',
                solid: true,
            });
            this.errorMessage = 'Could not retrieve authors.';
            this.$emit('errorOccurred', { display: 'Could not retrieve authors.', logging: 'Get All Authors Request Failure', error: error });
            this.displayLoading = false;
            this.displayError = true;
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