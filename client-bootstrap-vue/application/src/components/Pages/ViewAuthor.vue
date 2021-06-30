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
                <b-badge id="author-deleted-at" variant="danger" v-if="author.deletedAt" class="ml-3" style="font-size: 0.8rem; vertical-align: middle;">
                    Deleted
                    <b-tooltip target="author-deleted-at" placement="right" variant="primary">{{ prettyDateTime(author.deletedAt) }}</b-tooltip>
                </b-badge>
            </b-card-title>
            <div v-if="author.ActualAuthor" class="text-muted actual-author">Real Name: <b-link v-bind:to="'/author/' + author.ActualAuthor.id">{{ getAuthorFullName(author.ActualAuthor) }}</b-link></div>
            <b-list-group flush>
                <b-list-group-item>
                    <div class="h6">Tags <span class="muted">({{ author.Tags.length }})</span></div>
                    <TagSubList :tags="author.Tags" />
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Books <span class="muted">({{ author.BookAuthors.length }})</span></div>
                    <BookSubList :books="convertBookAuthorsToBooksList(author.BookAuthors)" />
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Pseudonyms <span class="muted">({{ author.Pseudonyms.length }})</span></div>
                    <AuthorSubList :authors="author.Pseudonyms" />
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
import AuthorSubList from '../PageElements/AuthorSubList.vue';
import BookSubList from '../PageElements/BookSubList.vue';
import TagSubList from '../PageElements/TagSubList.vue';
export default {
    name: "ViewAuthor",
    components: { AuthorSubList, BookSubList, TagSubList },
    data: function() {return {
        author: {},
    };},
    mixins: [authorhelpers, bookHelpers, apiResultsHelpers, pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getAuthorBrowseBreadcrumb(),this.getAuthorViewBreadcrumb()]);
        const authorId = this.validateIdValue(this.authorId);
        if (false !== authorId) { // Check Author ID Validation
            this.getAuthorById(authorId).then(authorMap => {

                // this.author = authorMap;
                this.author = authorMap.toJSON(); // TODO: Temporarily Convert ImmutableObjects to JS
                this.authorTags = this.author.Tags;
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
#author-view .author-name {
    text-align: center;
}
#author-view .list-group {
    font-size: 0.85rem;
}
#author-view .list-group .list-group-item .list-group .list-group-item span {
    font-size: 0.7rem;
}
</style>