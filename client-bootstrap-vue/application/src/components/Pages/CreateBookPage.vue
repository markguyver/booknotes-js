<template>
    <CreateBookElement ref="createBookElement" />
</template>

<script>
import CreateBookElement from '../PageElements/CreateBookElement';
export default {
    components: { CreateBookElement },
    name: 'CreateBookPage',
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getBookBrowseBreadcrumb(), this.getBookCreateBreadcrumb()]);
        setTimeout(() => this.$refs.createBookElement.setFocusToCreateBook(), 100);
    },
};
</script>

<style>
</style>