<template>
    <div id="author-view">
        <Loading v-if="displayLoading" />
        <b-card v-if="displayAuthor" :title="getAuthorFullName()">
            <pre>{{ author }}</pre>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Loading from './Loading.vue';
export default {
    name: "ViewAuthor",
    components: { Loading },
    props: ['authorId'],
    data: function() {return {
        displayLoading: true,
        displayAuthor: false,
        author: {},
    };},
    methods: {
        getAuthorFullName: function() {
            return (this.author.first_name ? this.author.first_name + ' ' : '') + (this.author.middle_name ? this.author.middle_name + ' ' : '') + this.author.last_name;
        },
    },
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getAuthorBrowseBreadcrumb(),this.getAuthorViewBreadcrumb()]);
        const authorId = parseInt(this.authorId);
        if (!isNaN(authorId)) { // Check for Numeric Author ID Parameter
            if (authorId > 0) { // Validate Author ID Parameter (Positive Integer Greater Than Zero)
                axios.get('/author/' + authorId).then(response => {
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
};
</script>

<style>
#author-view .author-name {
    text-align: center;
}
</style>