<template><div id="authors-browse">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <div class="mx-auto">{{ errorMessage }}</div>
        </b-col>
    </b-row>
    <b-row v-if="displayAuthors">
        <b-col class="pr-2">
            <SidebarFacets class="mr-2" />
        </b-col>
        <b-col cols="9" class="px-0 mr-3">
            <b-list-group>
                <b-list-group-item v-for="author in authorsOnPage" v-bind:key="author.id" v-bind:to="{ path: 'author/' + author.id }">
                    {{ displayAuthorNameLastFirst(author) }}
                    <b-badge pill class="book-count-badge" variant="info">#</b-badge>
                </b-list-group-item>
            </b-list-group>
        </b-col>
    </b-row>
</div></template>

<script>
import axios from 'axios';
import Loading from './Loading.vue';
import SidebarFacets from './SidebarFacets.vue';

const removePenNamesFilter = author => !author.parent_author_id;
const removeSoftDeletedAuthors = author => !author.deletedAt;

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
    };},
    methods: {
        displayAuthorNameLastFirst: author => author.last_name + (author.first_name ? ', ' + author.first_name + (author.middle_name ? ' ' + author.middle_name : '') : ''),
        defaultAuthorDisplay: function() {
            this.authorsOnPage = this.authors.filter(removePenNamesFilter).filter(removeSoftDeletedAuthors);
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
#authors-browse .book-count-badge {
    font-size: 0.6em;
    vertical-align: middle;
}
</style>