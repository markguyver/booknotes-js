<template>
    <CreateTagElement ref="createTagElement" />
</template>

<script>
import CreateTagElement from '../PageElements/CreateTagElement';
export default {
    components: { CreateTagElement },
    name: 'CreateTagPage',
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getTagBrowseBreadcrumb(), this.getTagCreateBreadcrumb()]);
        setTimeout(() => this.$refs.createTagElement.setFocusToCreateTag(), 100);
    },
};
</script>

<style>
</style>