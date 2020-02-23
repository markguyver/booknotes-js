<template><div id="author-view">
    <Loading v-if="displayLoading" />
    <b-card-group deck v-if="displayAuthor">
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
                    <b-list-group v-if="author.Tags.length" flush>
                        <b-list-group-item><b-badge v-for="tag in author.Tags" variant="tags" v-bind:key="tag.id" v-bind:to="'/tag/' + tag.id" class="ml-1">{{ tag.tag }}</b-badge></b-list-group-item>
                    </b-list-group>
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Books <span class="muted">({{ author.BookAuthors.length }})</span></div>
                    <b-list-group flush>
                        <b-list-group-item v-for="book in author.BookAuthors" v-bind:key="book.book_id" v-bind:to="'/book/' + book.book_id">{{ book.Book.title }} <span class="text-muted">(as {{ book.ContributionType.name }})</span></b-list-group-item>
                    </b-list-group>
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Pseudonyms <span class="muted">({{ author.Pseudonyms.length }})</span></div>
                </b-list-group-item>
            </b-list-group>
        </b-card>
    </b-card-group>
</div></template>

<script>
import authorhelpers from '../Mixins/authorHelpers';
import axios from 'axios';
import Loading from '../PageElements/Loading.vue';
export default {
    name: "ViewAuthor",
    components: { Loading },
    data: function() {return {
        displayLoading: true,
        displayAuthor: false,
        author: {},
    };},
    mixins: [authorhelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getAuthorBrowseBreadcrumb(),this.getAuthorViewBreadcrumb()]);
        const authorId = parseInt(this.authorId);
        if (!isNaN(authorId)) { // Check for Numeric Author ID Parameter
            if (authorId > 0) { // Validate Author ID Parameter (Positive Integer Greater Than Zero)
                axios.get('/author/' + authorId).then(response => {

                    /* eslint no-console: ["error", { allow: ["log"] }] */
                    console.log('Author View:', response.data.Authors[0]); // TODO Delete This

                    this.author = response.data.Authors[0];
                    this.displayLoading = false;
                    this.displayAuthor = true;
                }).catch(error => {
                    if (404 == error.response.status) { // Check Response Code for Recognized Errors (i.e. 404)

                        // TODO Handle Author Detail 404

                    } else { // Middle of Check Response Code for Recognized Errors (i.e. 404)
                        this.$emit('errorOccurred', { display: 'Error retrieving author.', logging: 'Get Author Request Failure', authorId: authorId, error: error });
                    } // End of Check Response Code for Recognized Errors (i.e. 404)
                });
            } else { // Middle of Validate Author ID Parameter (Positive Integer Greater Than Zero)
                this.$emit('errorOccurred', { display: 'Bad Author ID', logging: 'Author ID Parameter is Not a Positive Integer Greater Than Zero' });
            } // End of Validate Author ID Parameter (Positive Integer Greater Than Zero)
        } else { // Middle of Check for Numeric Author ID Parameter
            this.$emit('errorOccurred', { display: 'Bad Author ID', logging: 'Author ID Parameter is Not a Number' });
        } // End of Check for Numeric Author ID Parameter
        this.displayLoading = false;
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