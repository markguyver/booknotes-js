<template>
    <div id="author-create">
        <Loading v-if="displayLoading" />
    </div>
</template>

<script>
import Loading from './Loading.vue';

export default {
    name: "CreateAuthor",
    components: { Loading },
};
</script>

<style>
</style>