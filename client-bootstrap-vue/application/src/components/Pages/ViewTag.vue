<template><div id="tag-view">
    <b-row v-if="displayLoading | displayError">
        <b-col cols="10" class="mx-auto">
            <Loading v-if="displayLoading" />
            <PageError  v-if="displayError" :errorMessage="errorMessage" />
        </b-col>
    </b-row>
    <b-card-group deck v-if="displayPage">
        <b-card body-class="px-2 py-2">
            <b-card-title>{{ tag.tag }}</b-card-title>
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
import axios from 'axios';
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
	mixins: [pageHelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getTagBrowseBreadcrumb(),this.getTagViewBreadcrumb()]);


        /* eslint no-console: ["error", { allow: ["log"] }] */
        console.log('View Tag:', this); // TODO Delete This


        const tagId = parseInt(this.tagId);
        if (!isNaN(tagId)) { // Check for Numeric Book ID Parameter
            if (tagId > 0) { // Validate Author ID Parameter (Positive Integer Greater Than Zero)
                axios.get('/tag/' + tagId).then(response => {
                    this.tag = response.data.Tags[0];
                    this.tagAuthors = this.tag.Authors;
                    this.tagBooks = this.tag.Books;
                    this.tagNotes = this.tag.Notes;
                    this.transitionFromLoadingToPage();
                }).catch(error => {
                    if (404 == error.response.status) { // Check Response Code for Recognized Errors (i.e. 404)

                        // TODO Handle Book Detail 404

                    } else { // Middle of Check Response Code for Recognized Errors (i.e. 404)
                        this.transitionFromLoadingToError('Error retrieving tag.'); // Non-404 Error
                    } // End of Check Response Code for Recognized Errors (i.e. 404)
                });
            } else { // Middle of Validate Author ID Parameter (Positive Integer Greater Than Zero)
                this.transitionFromLoadingToError('Bad Tag ID.'); // Tag ID Parameter is Not a Positive Integer Greater Than Zero
            } // End of Validate Author ID Parameter (Positive Integer Greater Than Zero)
        } else { // Middle of Check for Numeric Author ID Parameter
            this.transitionFromLoadingToError('Bad Tag ID.'); // Tag ID Parameter is Not a Number
        } // End of Check for Numeric Author ID Parameter
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