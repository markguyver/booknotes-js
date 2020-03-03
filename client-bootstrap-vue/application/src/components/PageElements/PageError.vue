<template><div id="page-error">
     <div class="text-center text-light mx-auto my-3 px-2 py-2">{{ errorMessage }}</div>
</div></template>

<script>
export default {
    name: "PageError",
    props: {
        errorMessage: {
            type: String,
            required: true,
        },
    },
};
</script>

<style>
#page-error div {
    border-radius: .25rem;
    background-color: var(--crimson);
    border: 1px solid var(--crimson-dark);
}
</style>