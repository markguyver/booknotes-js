<template><div id="book-view">
    <Loading v-if="displayLoading" />
    <b-card-group deck v-if="displayBook">
        <b-card body-class="px-2 py-2">
            <b-card-title>{{ book.title }}</b-card-title>

            <b-list-group flush>
                <b-list-group-item>
                    <div class="h6">Tags <span class="muted">({{ book.Tags.length }})</span></div>
                    <b-list-group v-if="book.Tags.length" flush>
                        <b-list-group-item><b-badge v-for="tag in book.Tags" variant="tags" v-bind:key="tag.id" v-bind:to="'/tag/' + tag.id" class="ml-1">{{ tag.tag }}</b-badge></b-list-group-item>
                    </b-list-group>
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Authors <span class="muted">({{ book.BookAuthors.length }})</span></div>
                    <b-list-group flush>
                        <b-list-group-item v-for="author in book.BookAuthors" v-bind:key="author.author_id" v-bind:to="'/author/' + author.author_id">{{ getAuthorFullName(author.Author) }} <span class="text-muted">(as {{ author.ContributionType.name }})</span></b-list-group-item>
                    </b-list-group>
                </b-list-group-item>
                <b-list-group-item>
                    <div class="h6">Notes <span class="muted">({{ book.Notes.length }})</span></div>
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
    name: "ViewBook",
    components: { Loading },
    data: function() {return {
        displayLoading: true,
        displayBook: false,
        book: {},
    };},
    mixins: [authorhelpers],
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getBookBrowseBreadcrumb(),this.getBookViewBreadcrumb()]);


        /* eslint no-console: ["error", { allow: ["log"] }] */
        console.log('View Book:', this); // TODO Delete This


        const bookId = parseInt(this.bookId);
        if (!isNaN(bookId)) { // Check for Numeric Book ID Parameter
            if (bookId > 0) { // Validate Author ID Parameter (Positive Integer Greater Than Zero)
                axios.get('/book/' + bookId).then(response => {

                    /* eslint no-console: ["error", { allow: ["log"] }] */
                    console.log('Book View:', response.data.Books[0]); // TODO Delete This

                    this.book = response.data.Books[0];
                    this.displayLoading = false;
                    this.displayBook = true;
                }).catch(error => {
                    if (404 == error.response.status) { // Check Response Code for Recognized Errors (i.e. 404)

                        // TODO Handle Book Detail 404

                    } else { // Middle of Check Response Code for Recognized Errors (i.e. 404)
                        this.$emit('errorOccurred', { display: 'Error retrieving book.', logging: 'Get Book Request Failure', bookId: bookId, error: error });
                    } // End of Check Response Code for Recognized Errors (i.e. 404)
                });
            } else { // Middle of Validate Author ID Parameter (Positive Integer Greater Than Zero)
                this.$emit('errorOccurred', { display: 'Bad Book ID', logging: 'Book ID Parameter is Not a Positive Integer Greater Than Zero' });
            } // End of Validate Author ID Parameter (Positive Integer Greater Than Zero)
        } else { // Middle of Check for Numeric Author ID Parameter
            this.$emit('errorOccurred', { display: 'Bad Book ID', logging: 'Book ID Parameter is Not a Number' });
        } // End of Check for Numeric Author ID Parameter
        this.displayLoading = false;
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