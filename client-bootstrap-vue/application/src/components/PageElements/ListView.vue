<template>
    <b-row v-if="displayAuthors">
        <b-col class="pr-2">
            <SidebarFacets class="mr-2" :sidebarFacets="facetOptions" :sidebarFacetDataset="authors" v-on:resultsUpdated="updateAuthorsOnPage" />
        </b-col>
        <b-col cols="9" class="px-0 mr-3">
            <b-list-group>
                <b-list-group-item v-bind:variant="author.deleted_at ? 'light' : ''" v-for="author in authorsOnPage" v-bind:key="author.id" v-bind:to="{ path: 'author/' + author.id }" class="d-flex justify-content-between align-items-center">
                    {{ displayAuthorNameLastFirst(author) }}
                    <span>
                        <b-badge pill class="artist-badge text-light ml-1" variant="tags" v-for="tag in author.Tags" v-bind:key="tag.id">{{ tag.tag }}</b-badge>
                        <b-badge pill class="book-count-badge text-light ml-1" variant="info" v-if="author.bookCount">{{ author.bookCount + (author.bookCount > 1 ? ' books' : ' book') }}</b-badge>
                        <b-badge pill class="book-count-badge text-light ml-1" variant="danger" v-if="author.deleted_at">Deleted</b-badge>
                    </span>
                </b-list-group-item>
            </b-list-group>
        </b-col>
    </b-row>
</template>

<script>
import SidebarFacets from './SidebarFacets.vue';
export default {
    name: "ListView",
    components: [ SidebarFacets ],
}
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