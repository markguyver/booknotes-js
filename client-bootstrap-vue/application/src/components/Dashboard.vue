<template>
    <div>Coming Soon</div>
</template>

<script>
export default {
    name: "Dashboard",
    mounted: function() {
        this.$emit('breadcrumbsChange', []);
    },
}
</script>

<style>
</style>