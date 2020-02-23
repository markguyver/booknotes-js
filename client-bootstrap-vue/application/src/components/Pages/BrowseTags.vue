<template><div id="tags-browse">
    <p>Coming Soon</p>
</div></template>

<script>
export default {
    name: "BrowseTags",
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getTagBrowseBreadcrumb(true)]);
    },
}
</script>

<style>
</style>