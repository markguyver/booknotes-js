<template><div id="book-view">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <PageError  v-if="displayError" :errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-card-group deck v-if="displayPage">
        <b-card body-class="px-2 py-2">
            <b-card-title>{{ book.title }}</b-card-title>
            <b-list-group flush>
                <b-list-group-item>
                    <div class="h6">Tags <span class="muted">({{ bookTags.length }})</span></div>
                    <TagSubList :tags="bookTags" />

                    <!-- Adding a Tag to this Book Should be a Page Element Component -->

                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Authors <span class="muted">({{ bookAuthors.length }})</span></div>
                    <AuthorSubList :authors="convertBookAuthorsToAuthorsList(bookAuthors)" />

                    <!-- Adding an Author to this Book Should Be a Page Element Component -->

                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Notes <span class="muted">({{ bookNotes.length }})</span></div>
                    <NotesList :notes="bookNotes" />
                    <b-row class="mt-3"><b-col /><b-col cols="8"><NoteCreate v-on:noteCreated="fetchBookNotes" :bookId="book.id" /></b-col><b-col /></b-row>
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </b-card-group>
</div></template>

<script>
import authorHelpers from '../Mixins/authorHelpers';
import pageHelpers from '../Mixins/pageHelpers';
import axios from 'axios';
import NoteCreate from '../PageElements/Books/NoteCreate.vue';
import NotesList from '../PageElements/Books/NotesList.vue';
import AuthorSubList from '../PageElements/AuthorSubList.vue';
import TagSubList from '../PageElements/TagSubList.vue';
export default {
    name: "ViewBook",
    components: {
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
            axios.get('/notes/book/' + this.book.id).then(response => {
                this.bookNotes = response.data.Notes;
            }).catch(() => {
                this.bookNotes = [];
                this.popError('Could not retrieve notes.');
            });
        },
    },
	mixins: [authorHelpers, pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getBookBrowseBreadcrumb(),this.getBookViewBreadcrumb()]);


        /* eslint no-console: ["error", { allow: ["log"] }] */
        console.log('View Book:', this); // TODO Delete This


        const bookId = parseInt(this.bookId);
        if (!isNaN(bookId)) { // Check for Numeric Book ID Parameter
            if (bookId > 0) { // Validate Author ID Parameter (Positive Integer Greater Than Zero)
                axios.get('/book/' + bookId).then(response => {
                    this.book = response.data.Books[0];
                    this.bookAuthors = this.book.BookAuthors;
                    this.bookNotes = this.book.Notes;
                    this.bookTags = this.book.Tags;
                    this.transitionFromLoadingToPage();

                    console.log('Book Authors:', this.bookAuthors); // TODO Delete This
                    console.log('Authors from Book Authors:', this.convertBookAuthorsToAuthorsList(this.bookAuthors)); // TODO Delete This

                }).catch(error => {
                    if (404 == error.response.status) { // Check Response Code for Recognized Errors (i.e. 404)

                        // TODO Handle Book Detail 404

                    } else { // Middle of Check Response Code for Recognized Errors (i.e. 404)
                        this.transitionFromLoadingToError('Error retrieving book.'); // Non-404 Get Book Request Failure
                    } // End of Check Response Code for Recognized Errors (i.e. 404)
                });
            } else { // Middle of Validate Author ID Parameter (Positive Integer Greater Than Zero)
                this.transitionFromLoadingToError('Bad Book ID'); // Book ID Parameter is Not a Positive Integer Greater Than Zero
            } // End of Validate Author ID Parameter (Positive Integer Greater Than Zero)
        } else { // Middle of Check for Numeric Author ID Parameter
            this.transitionFromLoadingToError('Bad Book ID'); // Book ID Parameter is Not a Number
        } // End of Check for Numeric Author ID Parameter
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