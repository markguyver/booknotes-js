<template><div id="books-browse">
    <p>Coming Soon</p>
</div></template>

<script>
export default {
    name: "BrowseBooks",
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getBookBrowseBreadcrumb(true)]);
    },
}
</script>

<style>
</style>