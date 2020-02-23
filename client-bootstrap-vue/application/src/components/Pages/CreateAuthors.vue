<template>
    <div id="author-create">
        <Loading v-if="displayLoading" />
        <b-form>
            <b-form-group>
            </b-form-group>
        </b-form>
    </div>
</template>

<script>
import Loading from '../PageElements/Loading.vue';
export default {
    name: "CreateAuthors",
    components: { Loading },
    data: function() {return {
        displayLoading: false,
    };},
    methods: {
    },
    mounted: function() {
        this.$emit('breadcrumbsChange', [this.getHomeBreadcrumb(),this.getAuthorBrowseBreadcrumb(), this.getAuthorCreateBreadcrumb()]);
    },
};
</script>

<style>
</style>