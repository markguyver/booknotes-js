<template>
    <div id="author-view">
        <Loading v-if="displayLoading" />
    </div>
</template>

<script>
// import axios from 'axios';
import Loading from './Loading.vue';
/* eslint no-console: ["error", { allow: ["log", "error"] }] */

export default {
    name: "ViewAuthor",
    components: { Loading },
    props: ['authorId'],
    data: function() {return {
        displayLoading: true,
        displayAuthor: false,
        author: {},
    };},
    mounted: function() {
        // TODO Use Axios to Retrieve Author from Author ID
    },
};
</script>

<style>
</style>