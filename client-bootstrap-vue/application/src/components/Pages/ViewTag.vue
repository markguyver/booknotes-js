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
                    <div class="h6">Authors <span class="muted">({{ tagAuthors.length }})</span></div>
                    <AuthorSubList :authors="tagAuthors" />
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Books <span class="muted">({{ tagBooks.length }})</span></div>
                    <BookSubList :books="tagBooks" />
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Notes <span class="muted">({{ tagNotes.length }})</span></div>
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </b-card-group>
</div></template>

<script>
import apiResultsHelpers from '../Mixins/apiResultsHelpers';
import pageHelpers from '../Mixins/pageHelpers';
import AuthorSubList from '../PageElements/AuthorSubList.vue';
import BookSubList from '../PageElements/BookSubList.vue';
export default {
    name: "ViewTag",
    components: { AuthorSubList, BookSubList },
    data: function() {return {
        tag: {},
        tagAuthors: [],
        tagBooks: [],
        tagNotes: [],
    };},
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