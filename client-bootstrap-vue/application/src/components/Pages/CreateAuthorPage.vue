<template>
    <CreateAuthorElement />
</template>

<script>
import CreateAuthorElement from '../PageElements/CreateAuthorElement';
export default {
    components: { CreateAuthorElement },
    name: "CreateAuthorPage",
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getAuthorBrowseBreadcrumb(), this.getAuthorCreateBreadcrumb()]);
    },
};
</script>

<style>
</style>