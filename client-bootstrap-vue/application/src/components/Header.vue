<template>
    <b-navbar type="dark" variant="secondary">
        <b-navbar-brand to="/">Booknotes</b-navbar-brand>
        <b-navbar-nav class="ml-auto">
            <b-nav-item-dropdown text="Authors" right>
                <b-dropdown-item to="/authors">Browse Authors</b-dropdown-item>
                <b-dropdown-item>Create Author(s)</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item-dropdown text="Books" right>
                <b-dropdown-item href="#">Browse Books</b-dropdown-item>
            </b-nav-item-dropdown>
            <b-nav-item href="#" right>Tags</b-nav-item>
            <b-nav-form class="ml-4"><b-input-group>
                <b-form-input size="sm" placeholder="Search"></b-form-input>
                <b-input-group-append><b-button size="sm" class="my-2 my-sm-0" type="submit" variant="light"><b-icon icon="search"></b-icon></b-button></b-input-group-append>
            </b-input-group></b-nav-form>
        </b-navbar-nav>
    </b-navbar>
</template>

<script>
export default {
    name: "Header",
}
</script>

<style>
</style>