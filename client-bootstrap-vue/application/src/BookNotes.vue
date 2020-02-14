<template>
    <b-container class="booknotes-application">
        <Header v-bind:class="{ 'rounded-bottom': !breadcrumbs.length }" />
        <b-breadcrumb v-bind:items="breadcrumbs" v-if="breadcrumbs.length" class="mb-2"></b-breadcrumb>
        <router-view class="my-2" v-on:errorOccurred="handleErrorMessage" v-on:breadcrumbsChange="setBreadcrumbs" />
        <Footer />
    </b-container>
</template>

<script>
import Header from './components/Header.vue';
import Footer from './components/Footer.vue';
export default {
    name: 'BookNotes',
    components: {
        Header,
        Footer,
    },
    data: function() {return {
        breadcrumbs: [],
    };},
    methods: {
        handleErrorMessage: function(errorMessage) {

            /* eslint no-console: ["error", { allow: ["log", "error"] }] */
            console.log('BookNotes Parent App:', errorMessage); // TODO Delete This
            // TODO Add Error Message Toaster

        },
        setBreadcrumbs: function(breadcrumbsData) {
            this.breadcrumbs = breadcrumbsData;
        },
    },
}
</script>

<style>
.booknotes-application .breadcrumb {
    border-radius: 0 0 0.25rem 0.25rem;
    font-size: 0.8rem;
    padding: 0.5rem 0.75rem;
}
</style>