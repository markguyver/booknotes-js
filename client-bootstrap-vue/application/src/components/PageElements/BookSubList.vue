<template><div id="book-sub-list">
    <b-list-group v-if="books.length" flush>
        <b-list-group-item v-for="book in books" :key="book.id + (book.ContributionType ? ',' + book.ContributionType.id : 0)" :to="'/book/' + book.id">
            {{ book.title }}
            <span class="text-muted" v-if="book.ContributionType">(as {{ book.ContributionType.name }})</span>
            <span href="#" class="book-delete-button"><IconButton :id="'delete-book-button-' + book.id" href="#" @button-push="deleteBook(book)" activeIconName="dash-circle-fill" inactiveIconName="dash-circle" class="float-right" /></span>
            <b-tooltip :target="'delete-book-button-' + book.id" placement="left" variant="secondary">Remove Book Contribution</b-tooltip>
        </b-list-group-item>
    </b-list-group>
</div></template>

<script>
import IconButton from './IconButton.vue';
export default {
    components: { IconButton },
    methods: {
        deleteBook: function(book) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Delete Book Button Pushed, Book ID:', book); // TODO: Delete This

            this.$emit('remove-book', book);
        },
    },
    name: "BookSubList",
    props: {
        books: {
            required: true,
            type: Array,
        },
    },
};
</script>

<style>
#book-sub-list .list-group {
    font-size: 0.85rem;
}
#book-sub-list .list-group .list-group-item .list-group .list-group-item span {
    font-size: 0.7rem;
}
#book-sub-list .list-group .list-group-item span.book-delete-button {
    padding-left: 0.3rem;
}
</style>