<template>
    <CreateTagElement />
</template>

<script>
import CreateTagElement from '../PageElements/CreateTagElement';
export default {
    components: { CreateTagElement },
    name: 'CreateTagPage',
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getTagBrowseBreadcrumb(), this.getTagCreateBreadcrumb()]);
    },
};
</script>

<style>
</style>