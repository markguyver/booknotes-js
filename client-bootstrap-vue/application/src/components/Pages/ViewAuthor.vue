<template><div id="author-view">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <PageError  v-if="displayError" :errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-card-group deck v-if="displayPage">
        <b-card body-class="px-2 py-2">
            <b-card-title>
                {{ getAuthorFullName(author) }}
                <b-badge id="author-deleted-at" variant="danger" v-if="author.deletedAt" class="ml-3">
                    Deleted
                    <b-tooltip target="author-deleted-at" placement="right" variant="primary">{{ prettyDateTime(author.deletedAt) }}</b-tooltip>
                </b-badge>
                <b-badge id="author-is-pseudonym" variant="pseudonym" v-if="author.ActualAuthor" class="ml-3">
                    Pseudonym
                    <b-tooltip target="author-is-pseudonym" placement="right" variant="primary dark">Real Name:<br /><b-link :to="'/author/' + author.ActualAuthor.id" class="text-reset">{{ getAuthorFullName(author.ActualAuthor) }}</b-link></b-tooltip>
                </b-badge>
            </b-card-title>
            <b-list-group flush>
                <b-list-group-item>
                    <div class="h6">Tags <span class="muted">({{ author.Tags.length }})</span> <IconButton id="add-tag-to-author-button" @button-push-left="collapseAddTagButtonPushed()" :activeIconName="collapseAddTagActiveButton" :inactiveIconName="collapseAddTagInactiveButton" class="float-right" /></div>
                    <b-tooltip target="add-tag-to-author-button" placement="left" variant="secondary">{{ addTagButtonTooltipText }}</b-tooltip>
                    <b-collapse v-model="collapseAddTagVisible">
                        <AddTagElement :existingTags="author.Tags" @add-tag="addTagtoAuthor" ref="addTagComponent" />
                    </b-collapse>
                    <TagSubList :tags="author.Tags" @remove-tag="removeTagFromAuthor" />
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Book Contributions <span class="muted">({{ author.BookAuthors.length }})</span> <IconButton id="add-book-to-author-button" @button-push-left="addBookstoAuthor()" class="float-right" /></div>
                    <b-tooltip target="add-book-to-author-button" placement="left" variant="secondary">Add Book(s) to Author</b-tooltip>
                    <BookSubList :books="convertBookAuthorsToBooksList(author.BookAuthors)" @remove-book="removeBookFromAuthor" />
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Pseudonyms <span class="muted">({{ author.Pseudonym.length }})</span></div>
                    <AuthorSubList :authors="author.Pseudonym" :pseudonyms=true />
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </b-card-group>
</div></template>

<script>
import authorhelpers from '../Mixins/authorHelpers';
import bookHelpers from '../Mixins/bookHelpers';
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
import IconButton from '../PageElements/IconButton.vue';
import AuthorSubList from '../PageElements/AuthorSubList.vue';
import BookSubList from '../PageElements/BookSubList.vue';
import AddTagElement from '../PageElements/AddTagElement.vue';
import TagSubList from '../PageElements/TagSubList.vue';
export default {
    name: "ViewAuthor",
    components: { AuthorSubList, BookSubList, AddTagElement, TagSubList, IconButton },
    data: function() {return {
        author: {},
        collapseAddTagVisible: false,
        collapseAddTagActiveButton: '',
        collapseAddTagInactiveButton: '',
        addTagButtonTooltipText: '',
    };},
    methods: {
        addTagtoAuthor: function(tagToAdd) {
            this.putTagToAuthor(tagToAdd.id, this.author.id)
                .then(() => {
                    this.author.Tags.push(tagToAdd);
                    this.$refs.addTagComponent.clearAddTagInput();
                    this.popInfo('Tag has been added');
                })
                .catch(() => this.popError('Failed to add tag to author'));
        },
        addBookstoAuthor: function() {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Add Books to Author Button Pushed');
        },
        removeBookFromAuthor: function(book) {
            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('Remove Book From Author, Book:', book);
        },
        removeTagFromAuthor: function(tagId) {
            this.deleteAuthorTagById(this.author.id, tagId).then(() => {
                this.popInfo('The tag has been removed from the author.');
                this.author.Tags = this.author.Tags.filter(currentTag => currentTag.id !== tagId);
            }).catch(() => this.popError('Failed to remove the tag from the author.', 'Deletion Error'));
        },
        collapseAddTagButtonPushed: function() {
            if (this.collapseAddTagVisible) { // Check Create Note Button State and Toggle
                this.setAddTagButtonToCollapsedState();
                this.$refs.addTagComponent.clearAddTagInput();
            } else { // Middle of Check Create Note Button State and Toggle
                this.setAddTagButtonToExpandedState();
            } // End of Check Create Note Button State and Toggle
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
    },
    mixins: [authorhelpers, bookHelpers, apiResultsHelpers, pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getAuthorBrowseBreadcrumb(),this.getAuthorViewBreadcrumb()]);
        const authorId = this.validateIdValue(this.authorId);
        if (false !== authorId) { // Check Author ID Validation
            this.getAuthorById(authorId).then(authorMap => {

                // this.author = authorMap;
                this.author = authorMap.toJSON(); // TODO: Temporarily Convert ImmutableObjects to JS
                this.authorTags = this.author.Tags;
                this.setAddTagButtonToCollapsedState();
                this.transitionFromLoadingToPage();

            }).catch(() => this.transitionFromLoadingToError('Error retrieving author.'));
        } else { // Middle of Check Author ID Validation
            this.transitionFromLoadingToError('Bad Author ID');
        } // End of Check Author ID Validation
    },
    props: ['authorId'],
};
</script>

<style>
#author-view .card-title .badge {
    font-size: 0.8rem;
    vertical-align: middle;
}
#author-view .list-group {
    font-size: 0.85rem;
}
#author-view .list-group .list-group-item .list-group .list-group-item span {
    font-size: 0.7rem;
}
</style>