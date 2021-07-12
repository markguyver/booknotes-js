<template><div id="book-sub-list">
    <b-list-group v-if="books.length" flush>
        <b-list-group-item v-for="book in books" v-bind:key="book.id" v-bind:to="'/book/' + book.id">
            {{ book.title }}
            <span class="text-muted" v-if="book.ContributionType">(as {{ book.ContributionType }})</span>
            <span href="#" class="book-delete-button"><IconButton href="#" v-on:button-push="deleteBook(book.id)" activeIconName="dash-circle-fill" inactiveIconName="dash-circle" /></span>
        </b-list-group-item>
    </b-list-group>
</div></template>

<script>
import IconButton from './IconButton.vue';
export default {
    components: { IconButton },
    methods: {
        deleteBook: function(bookId) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Delete Book Button Pushed, Book ID:', bookId);
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