<template>
    <div id="authors-browse">
        <Loading v-if="displayLoading" />
        <b-list-group v-if="displayAuthors" class="my-2">
            <b-list-group-item v-for="author in authors" v-bind:key="author.id" v-bind:to="'author/' + author.id" v-bind:author="author">
                {{ displayAuthorNameLastFirst(author) }}
                <b-badge pill class="book-count-badge">#</b-badge>
            </b-list-group-item>
        </b-list-group>
    </div>
</template>

<script>
import axios from 'axios';
import Loading from './Loading.vue';

const removePenNamesFilter = author => !author.parent_author_id;

export default {
    name: "BrowseAuthors",
    components: { Loading },
    data: function() {return {
        authors: [],
        displayAuthors: false,
        displayLoading: true,
    };},
    methods: {
        displayAuthorNameLastFirst: author => author.last_name + (author.first_name ? ', ' + author.first_name + (author.middle_name ? ' ' + author.middle_name : '') : ''),
    },
    mounted: function() {
        axios.get('/authors').then(response => {
            this.authors = response.data.Authors.filter(removePenNamesFilter);
            this.displayLoading = false;
            this.displayAuthors = true;
        }).catch(error => {

            /* eslint no-console: ["error", { allow: ["error"] }] */
            console.error('Get All Authors Error:', error); // TODO Delete Me

        });
    },
};
</script>

<style>
#authors-browse .book-count-badge {
    font-size: 0.5em;
    vertical-align: middle;
}
</style>