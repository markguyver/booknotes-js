<template>
    <b-container class="booknotes-application">
        <Header />
        <router-view class="my-2" />
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
}
</script>

<style>
</style>
