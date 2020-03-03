<template><div id="tags-browse">
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
                <b-list-group-item v-bind:variant="tag.deleted_at ? 'light' : ''" v-for="tag in tagsOnPage" v-bind:key="tag.id" v-bind:to="{ path: 'tag/' + tag.id }" class="d-flex justify-content-between align-items-center">
                    {{ tag.tag }}
                    <span>
                        <b-badge pill class="artist-badge text-light ml-1" variant="tags" v-if="tag.authorCount">{{ tag.authorCount + (1 == tag.authorCount ? ' author' : ' authors' ) }}</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="info" v-if="tag.bookCount">{{ tag.bookCount + (1 == tag.bookCount ? ' book' : ' books' ) }}</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="pseudonym" v-if="tag.noteCount">{{ tag.noteCount + (1 == tag.noteCount ? ' note' : ' notes' ) }}</b-badge>
                        <b-badge pill class="artist-badge text-light ml-1" variant="danger" v-if="tag.deleted_at">Deleted</b-badge>
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
        tags: [],
        tagsOnPage: [],
    }; },
    name: "BrowseTags",
	mixins: [pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getTagBrowseBreadcrumb(true)]);
        axios.get('/tags').then(response => {
            this.tags = response.data.Tags;
            this.tagsOnPage = this.tags;

            /* eslint no-console: ["error", { allow: ["log"] }] */
            console.log('Browse Tags:', this.tags);

            // this.defaultAuthorDisplay();
            this.transitionFromLoadingToPage();
        }).catch(() => {
            this.transitionFromLoadingToError('Could not retrieve tags.');
        });
    },
}
</script>

<style>
#tags-browse .list-group .list-group-item {
    font-size: 0.8rem;
    padding: 0.5rem 1rem;
}
#tags-browse .list-group .list-group-item .artist-badge {
    font-size: 0.6rem;
    vertical-align: middle;
}
</style>