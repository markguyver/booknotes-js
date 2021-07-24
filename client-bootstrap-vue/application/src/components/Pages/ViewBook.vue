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
                    <div class="h6">Tags <span class="muted">({{ bookTags.length }})</span> <IconButton id="add-tag-to-book-button" @button-push-left="collapseAddTagButtonPushed()" :activeIconName="collapseAddTagActiveButton" :inactiveIconName="collapseAddTagInactiveButton" class="float-right" /></div>
                    <b-tooltip target="add-tag-to-book-button" placement="left" variant="secondary">{{ addTagButtonTooltipText }}</b-tooltip>
                    <b-collapse v-model="collapseAddTagVisible">
                        <AddTagElement :existingTags="bookTags" @add-tag="addTagToBook" ref="addTagComponent" />
                    </b-collapse>
                    <TagSubList :tags="bookTags" @remove-tag="removeTagFromBook" />
                </b-list-group-item>
                <b-list-group-item id="book-authors">
                    <div class="h6">Authors <span class="muted">({{ bookAuthors.length }})</span> <IconButton id="add-author-to-book-button" @button-push-left="collapseAddAuthorButtonPushed()" :activeIconName="collapseAddAuthorActiveButton" :inactiveIconName="collapseAddAuthorInactiveButton" class="float-right" /></div>
                    <b-tooltip target="add-author-to-book-button" placement="left" variant="secondary">{{ addAuthorButtonTooltipText }}</b-tooltip>
                    <b-collapse v-model="collapseAddAuthorVisible">
                        <AddBookAuthorContributionElement context="book" :contextId="book.id" :existingResources="bookAuthors" @add-book-author-contribution="addAuthorToBook" ref="addBookAuthorContributionComponent" />
                    </b-collapse>
                    <AuthorSubList :authors="convertBookAuthorsToAuthorsList(bookAuthors)" @remove-author="removeAuthorFromBook" />
                </b-list-group-item>
                <b-list-group-item id="book-notes">
                    <div class="h6">Notes <span class="muted">({{ bookNotes.length }})</span> <IconButton id="add-note-to-book-button" @button-push-left="collapseNoteCreateButtonPushed" :activeIconName="collapseNoteCreateActiveButton" :inactiveIconName="collapseNoteCreateInactiveButton" class="float-right" /></div>
                    <b-tooltip target="add-note-to-book-button" placement="left" variant="secondary">{{ noteCreateButtonTooltipText }}</b-tooltip>
                    <b-collapse v-model="collapseNoteCreateVisible">
                        <CreateNoteElement @noteCreated="fetchBookNotes" :bookId="book.id" ref="createNoteComponent" />
                    </b-collapse>
                    <NotesSubList :notes="bookNotes" :key="noteListKey" @note-deleted="removeNoteFromList" />
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
import CreateNoteElement from '../PageElements/CreateNoteElement.vue';
import NotesSubList from '../PageElements/NotesSubList.vue';
import AddBookAuthorContributionElement from '../PageElements/AddBookAuthorContributionElement.vue';
import AuthorSubList from '../PageElements/AuthorSubList.vue';
import AddTagElement from '../PageElements/AddTagElement.vue';
import TagSubList from '../PageElements/TagSubList.vue';
export default {
    name: "ViewBook",
    components: {
        IconButton,
        NotesSubList,
        CreateNoteElement,
        AddBookAuthorContributionElement,
        AuthorSubList,
        AddTagElement,
        TagSubList,
    },
    data: function() {return {
        book: {},

        bookAuthors: [],
        collapseAddAuthorVisible: false,
        collapseAddAuthorActiveButton: '',
        collapseAddAuthorInactiveButton: '',
        addAuthorButtonTooltipText: '',

        bookNotes: [],
        noteListKey: '',
        collapseNoteCreateVisible: false,
        collapseNoteCreateActiveButton: '',
        collapseNoteCreateInactiveButton: '',
        noteCreateButtonTooltipText: '',

        bookTags: [],
        collapseAddTagVisible: false,
        collapseAddTagActiveButton: '',
        collapseAddTagInactiveButton: '',
        addTagButtonTooltipText: '',
    };},
    methods: {

        // Book Notes Methods
        setNoteListKey: function() {
            this.noteListKey = this.bookNotes.map(currentNote => currentNote.id).join(',');
        },
        fetchBookNotes: function() {
            this.getNotesByBookId(this.book.id).then(noteList => {
                // this.bookNotes = noteList;
                this.bookNotes = noteList.map(currentNote => currentNote.toJSON()).toJSON(); // TODO: Temporarily Convert ImmutableObjects to JS
                this.setNoteListKey();
            }).catch(() => {
                this.bookNotes = [];
                this.popError('Could not retrieve notes.');
            });
        },
        removeNoteFromList: function(noteId) {
            // TODO: Update the Note Count Without Forcing a Complete Reload
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Update Note Count Because Note Was Removed, Note ID:', noteId);
        },
        collapseNoteCreateButtonPushed: function() {
            if (this.collapseNoteCreateVisible) { // Check Create Note Button State and Toggle
                this.setCreateNoteButtonToCollapsedState();
                this.$refs.createNoteComponent.clearNoteContent();
            } else { // Middle of Check Create Note Button State and Toggle
                this.setCreateNoteButtonToExpandedState();
            } // End of Check Create Note Button State and Toggle
        },
        setCreateNoteButtonToCollapsedState: function() {
            this.collapseNoteCreateInactiveButton = 'plus-circle';
            this.collapseNoteCreateActiveButton = 'plus-circle-fill';
            this.noteCreateButtonTooltipText = 'Show Create Note';
            this.collapseNoteCreateVisible = false;
        },
        setCreateNoteButtonToExpandedState: function() {
            this.collapseNoteCreateInactiveButton = 'arrow-up-circle';
            this.collapseNoteCreateActiveButton = 'arrow-up-circle-fill';
            this.noteCreateButtonTooltipText = 'Hide Create Note';
            this.collapseNoteCreateVisible = true;
        },

        // Book Tags Methods
        addTagToBook: function(tagToAdd) {
            this.putTagToBook(tagToAdd.id, this.book.id)
                .then(() => {
                    this.bookTags.push(tagToAdd);
                    this.$refs.addTagComponent.clearAddTagInput();
                    this.popInfo('Tag has been added');
                })
                .catch(() => this.popError('Failed to add tag to book'));
        },
        removeTagFromBook: function(tagId) {
            this.deleteBookTagById(this.book.id, tagId).then(() => {
                this.popInfo('The tag has been removed from the book.');
                this.bookTags = this.bookTags.filter(currentTag => currentTag.id !== tagId);
            }).catch(() => this.popError('Failed to remove the tag from the book.', 'Deletion Error'));
        },
        collapseAddTagButtonPushed: function() {
            if (this.collapseAddTagVisible) { // Check Add Tag Button State and Toggle
                this.setAddTagButtonToCollapsedState();
                this.$refs.addTagComponent.clearAddTagInput();
            } else { // Middle of Check Add Tag Button State and Toggle
                this.setAddTagButtonToExpandedState();
            } // End of Check Add Tag Button State and Toggle
        },
        setAddTagButtonToCollapsedState: function() {
            this.collapseAddTagInactiveButton = 'plus-circle';
            this.collapseAddTagActiveButton = 'plus-circle-fill';
            this.addTagButtonTooltipText = 'Add Tag(s) to Author';
            this.collapseAddTagVisible = false;
        },
        setAddTagButtonToExpandedState: function() {
            this.collapseAddTagInactiveButton = 'arrow-up-circle';
            this.collapseAddTagActiveButton = 'arrow-up-circle-fill';
            this.addTagButtonTooltipText = 'Hide Add Tag(s)';
            this.collapseAddTagVisible = true;
        },

        // Book Authors Methods
        addAuthorToBook: function(newAuthorValue) {
            this.bookAuthors.push(newAuthorValue);
        },
        removeAuthorFromBook: function(author) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Remove Author From Book, Author:', author);
        },
        collapseAddAuthorButtonPushed: function() {
            if (this.collapseAddAuthorVisible) { // Check Add Book Button State and Toggle
                this.setAddAuthorButtonToCollapsedState();
                this.$refs.addBookAuthorContributionComponent.resetCreateBookAuthorContributionFormInputs();
            } else { // Middle of Check Add Book Button State and Toggle
                this.setAddAuthorButtonToExpandedState();
            } // End of Check Add Book Button State and Toggle
        },
        setAddAuthorButtonToCollapsedState: function() {
            this.collapseAddAuthorInactiveButton = 'plus-circle';
            this.collapseAddAuthorActiveButton = 'plus-circle-fill';
            this.addAuthorButtonTooltipText = 'Add Author(s) to Book';
            this.collapseAddAuthorVisible = false;
        },
        setAddAuthorButtonToExpandedState: function() {
            this.collapseAddAuthorInactiveButton = 'arrow-up-circle';
            this.collapseAddAuthorActiveButton = 'arrow-up-circle-fill';
            this.addAuthorButtonTooltipText = 'Hide Add Author(s)';
            this.collapseAddAuthorVisible = true;
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
                this.setNoteListKey();
                this.bookTags = this.book.Tags;
                this.setCreateNoteButtonToCollapsedState();
                this.setAddTagButtonToCollapsedState();
                this.setAddAuthorButtonToCollapsedState();
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