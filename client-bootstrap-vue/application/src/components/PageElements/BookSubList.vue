<template><div id="book-sub-list">
    <b-list-group v-if="books.length" flush>
        <b-list-group-item v-for="book in books" v-bind:key="book.id" v-bind:to="'/book/' + book.id">
            {{ book.title }}
            <span class="text-muted" v-if="book.ContributionType">(as {{ book.ContributionType }})</span>
        </b-list-group-item>
    </b-list-group>
</div></template>

<script>
export default {
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
</style>