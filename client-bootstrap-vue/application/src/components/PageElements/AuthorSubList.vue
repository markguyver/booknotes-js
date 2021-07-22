<template><div id="author-sub-list">
    <b-list-group v-if="authors.length" flush>
        <b-list-group-item v-for="author in authors" :key="author.id + (author.ContributionType ? ',' + author.ContributionType.id : 0)" :to="'/author/' + author.id">
            {{ getAuthorFullName(author) }}
            <span class="text-muted" v-if="author.ContributionType">(as {{ author.ContributionType.name }})</span>
            <span class="author-delete-button" @click.prevent><IconButton :id="'delete-author-button-' + author.id" @button-push-left="deleteAuthor(author)" activeIconName="dash-circle-fill" inactiveIconName="dash-circle" class="float-right" /></span>
            <b-tooltip :target="'delete-author-button-' + author.id" placement="left" variant="secondary">Remove {{ pseudonyms ? 'Pseudonym' : 'Author' }}</b-tooltip>
        </b-list-group-item>
    </b-list-group>
</div></template>

<script>
import authorHelpers from '../Mixins/authorHelpers';
import IconButton from './IconButton.vue';
export default {
    components: { IconButton },
    methods: {
        deleteAuthor: function(author) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Delete Author Button Pushed, Author ID:', author); // TODO: Delete This

            this.$emit('remove-author', author);
        },
    },
    mixins: [authorHelpers],
    name: "AuthorSubList",
    props: {
        authors: {
            required: true,
            type: Array,
        },
        pseudonyms: {
            default: false,
            type: Boolean,
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