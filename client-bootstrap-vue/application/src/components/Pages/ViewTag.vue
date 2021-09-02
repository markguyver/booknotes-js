<template><div id="tag-view">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <PageError  v-if="displayError" :errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-card-group deck v-if="displayPage">
        <b-card body-class="px-2 py-2">
            <b-card-title>
                {{ tag.tag }}
                <b-badge id="tag-deleted-at" variant="danger" v-if="tag.deletedAt" class="ml-3" style="font-size: 0.8rem; vertical-align: middle;">
                    Deleted
                    <b-tooltip target="tag-deleted-at" placement="right" variant="primary">{{ prettyDateTime(tag.deletedAt) }}</b-tooltip>
                </b-badge>
            </b-card-title>
            <b-list-group flush>
                <b-list-group-item>
                    <div class="h6">Authors <span class="muted">({{ tagAuthors.length }})</span> <IconButton id="add-author-to-tag-button" @button-push-left="addAuthorsToTag" class="float-right" /></div>
                    <b-tooltip target="add-author-to-tag-button" placement="left" variant="secondary" triggers="hover">Add Author(s) to Tag</b-tooltip>
                    <AuthorSubList :authors="tagAuthors" @remove-author="removeAuthorFromTag" />
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Books <span class="muted">({{ tagBooks.length }})</span> <IconButton id="add-book-to-tag-button" @button-push-left="addBooksToTag" class="float-right" /></div>
                    <b-tooltip target="add-book-to-tag-button" placement="left" variant="secondary" triggers="hover">Add Book(s) to Tag</b-tooltip>
                    <BookSubList :books="tagBooks" @remove-book="removeBookFromTag" />
                </b-list-group-item>
                <!--
                <b-list-group-item>
                    <div class="h6">Notes <span class="muted">({{ tagNotes.length }})</span></div>
                </b-list-group-item>
                -->
            </b-list-group>
        </b-card>
    </b-card-group>
</div></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
import IconButton from '../PageElements/IconButton.vue';
import AuthorSubList from '../PageElements/AuthorSubList.vue';
import BookSubList from '../PageElements/BookSubList.vue';
export default {
    name: "ViewTag",
    components: { AuthorSubList, BookSubList, IconButton },
    data: function() {return {
        tag: {},
        tagAuthors: [],
        tagBooks: [],
        tagNotes: [],
    };},
    methods: {

        // Tag Authors Methods
        addAuthorsToTag: function() {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Add Authors to Tag Button Pushed');
        },
        removeAuthorFromTag: function(author) {
            this.deleteAuthorTagById(author.id, this.tag.id).then(() => {
                this.popInfo('The author has been removed from the tag.');
                this.tagAuthors = this.tagAuthors.filter(currentAuthor => currentAuthor.id !== author.id);
            }).catch(() => this.popError('Failed to remove the author from the tag.', 'Deletion Error'));
        },

        // Tag Books Methods
        addBooksToTag: function() {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Add Books to Tag Button Pushed');
        },
        removeBookFromTag: function(book) {
            this.deleteBookTagById(book.id, this.tag.id).then(() => {
                this.popInfo('The book has been removed from the tag.');
                this.tagBooks = this.tagBooks.filter(currentBook => currentBook.id !== book.id);
            }).catch(() => this.popError('Failed to remove the book from the tag.', 'Deletion Error'));
        },

    },
	mixins: [pageHelpers, apiResultsHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getTagBrowseBreadcrumb(),this.getTagViewBreadcrumb()]);
        const tagId = this.validateIdValue(this.tagId);
        if (false !== tagId) { // Check Tag ID Validation
            this.getTagById(tagId).then(tagMap => {

                // this.tag = tagMap;
                this.tag = tagMap.toJSON(); // TODO: Temporarily Convert ImmutableObjects to JS
                this.tagAuthors = this.tag.Authors;
                this.tagBooks = this.tag.Books;
                this.tagNotes = this.tag.Notes;
                this.transitionFromLoadingToPage();

            }).catch(() => this.transitionFromLoadingToError('Error retrieving tag.'));
        } else { // Middle of Check Tag ID Validation
            this.transitionFromLoadingToError('Bad Tag ID');
        } // End of Check Tag ID Validation
    },
    props: ['tagId'],
}
</script>

<style>
#tag-view .list-group {
    font-size: 0.85rem;
}
#tag-view .list-group .list-group-item .list-group .list-group-item span {
    font-size: 0.7rem;
}
</style>