<template><div id="book-view">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <PageError  v-if="displayError" :errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-card-group deck v-if="displayPage">
        <b-card body-class="px-2 py-2">
            <b-card-title>
                {{ book.title }}
                <b-badge id="book-deleted-at" variant="danger" v-if="book.deletedAt" class="ml-3" style="font-size: 0.8rem; vertical-align: middle;">
                    Deleted
                    <b-tooltip target="book-deleted-at" placement="right" variant="primary">{{ prettyDateTime(book.deletedAt) }}</b-tooltip>
                </b-badge>
            </b-card-title>
            <b-list-group flush>
                <b-list-group-item id="book-tags">
                    <div class="h6">Tags <span class="muted">({{ bookTags.length }})</span> <IconButton v-on:button-push="addTagsToBook()" /></div>
                    <TagSubList :tags="bookTags" />

                    <!-- Adding a Tag to this Book Should be a Page Element Component -->

                </b-list-group-item>
                <b-list-group-item id="book-authors">
                    <div class="h6">Authors <span class="muted">({{ bookAuthors.length }})</span> <IconButton v-on:button-push="addAuthorsToBook()" /></div>
                    <AuthorSubList :authors="convertBookAuthorsToAuthorsList(bookAuthors)" />

                    <!-- Adding an Author to this Book Should Be a Page Element Component -->

                </b-list-group-item>
                <b-list-group-item id="book-notes">
                    <div class="h6">Notes <span class="muted">({{ bookNotes.length }})</span></div>
                    <NotesList :notes="bookNotes" />
                    <b-row class="mt-3"><b-col /><b-col cols="12"><NoteCreate v-on:noteCreated="fetchBookNotes" :bookId="book.id" /></b-col><b-col /></b-row>
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </b-card-group>
</div></template>

<script>
import authorHelpers from '../Mixins/authorHelpers';
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
import IconButton from '../PageElements/IconButton.vue';
import NoteCreate from '../PageElements/Books/NoteCreate.vue';
import NotesList from '../PageElements/Books/NotesList.vue';
import AuthorSubList from '../PageElements/AuthorSubList.vue';
import TagSubList from '../PageElements/TagSubList.vue';
export default {
    name: "ViewBook",
    components: {
        IconButton,
        NotesList,
        NoteCreate,
        AuthorSubList,
        TagSubList,
    },
    data: function() {return {
        book: {},
        bookAuthors: [],
        bookNotes: [],
        bookTags: [],
    };},
    methods: {
        fetchBookNotes: function() {
            this.getNotesByBookId(this.book.id).then(noteList => {
                // this.bookNotes = noteList;
                this.bookNotes = noteList.map(currentNote => currentNote.toJSON()).toJSON(); // TODO: Temporarily Convert ImmutableObjects to JS
            }).catch(() => {
                this.bookNotes = [];
                this.popError('Could not retrieve notes.');
            });
        },
        addTagsToBook: function() {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Add Tags to Book Button Pushed');
        },
        addAuthorsToBook: function() {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Add Authors to Book Button Pushed');
        },
    },
	mixins: [authorHelpers, apiResultsHelpers, pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getBookBrowseBreadcrumb(),this.getBookViewBreadcrumb()]);
        const bookId = this.validateIdValue(this.bookId);
        if (false !== bookId) { // Check Book ID Validation
            this.getBookById(bookId).then(bookMap => {

                // this.book = bookMap;
                this.book = bookMap.toJSON(); // TODO: Temporarily Convert ImmutableObjects to JS
                this.bookAuthors = this.book.BookAuthors;
                this.bookNotes = this.book.Notes;
                this.bookTags = this.book.Tags;
                this.transitionFromLoadingToPage();

            }).catch(() => this.transitionFromLoadingToError('Error retrieving book.'));
        } else { // Middle of Check Book ID Validation
            this.transitionFromLoadingToError('Bad Book ID');
        } // End of Check Book ID Validation
    },
    props: ['bookId'],
}
</script>

<style>
#book-view .list-group {
    font-size: 0.85rem;
}
#book-view .list-group .list-group-item .list-group .list-group-item span {
    font-size: 0.7rem;
}
</style>