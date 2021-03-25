<template>
    <b-navbar type="dark" rounded variant="primary" class="footer mb-2">
        <div id="footer-copyright" class="w-100 text-center"><a class="text-light" target="_new" href="https://github.com/markguyver">&copy; 2020 - 2021 Mark Chavez</a></div>
    </b-navbar>
</template>

<script>
export default {
    name: "Footer",
}
</script>

<style>
.footer {
    border-radius: 0.25rem;
}
.footer div#footer-copyright {
    font-size: 0.75rem;
}
.footer div#footer-copyright a {
    text-decoration: none !important;
}
</style>