<template><div id="author-sub-list">
    <b-list-group v-if="authors.length" flush>
        <b-list-group-item v-for="author in authors" v-bind:key="author.id" v-bind:to="'/author/' + author.id">
            {{ getAuthorFullName(author) }}
            <span class="text-muted" v-if="author.ContributionType">(As {{ author.ContributionType }})</span>
            <span href="#" class="author-delete-button"><IconButton href="#" v-on:button-push="deleteAuthor(author.id)" activeIconName="dash-circle-fill" inactiveIconName="dash-circle" /></span>
        </b-list-group-item>
    </b-list-group>
</div></template>

<script>
import authorHelpers from '../Mixins/authorHelpers';
import IconButton from './IconButton.vue';
export default {
    components: { IconButton },
    methods: {
        deleteAuthor: function(authorId) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Delete Author Button Pushed, Author ID:', authorId);
        },
    },
    mixins: [authorHelpers],
    name: "AuthorSubList",
    props: {
        authors: {
            required: true,
            type: Array,
        },
    },
};
</script>

<style>
#author-sub-list .list-group {
    font-size: 0.85rem;
}
#author-sub-list .list-group .list-group-item .list-group .list-group-item span {
    font-size: 0.7rem;
}
#author-sub-list .list-group .list-group-item span.author-delete-button {
    padding-left: 0.3rem;
}
</style>