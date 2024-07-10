<script setup lang="ts">
import { RouterLink, RouterView } from "vue-router";
</script>

<template>
    <nav>
        <RouterLink to="/">Convert</RouterLink>
        <RouterLink to="/draw">Draw</RouterLink>
        <RouterLink to="/contour">Contour</RouterLink>
    </nav>

    <RouterView />
</template>

<style lang="scss" scoped>
nav {
    display: flex;
    flex-direction: row;
    border-bottom: 1px solid #c4c4c4;

    a {
        padding: 6px 8px;
        text-decoration: none;
        color: cornflowerblue;

        &:hover:not(.router-link-exact-active) {
            background-color: #eaeaea;
        }

        &.router-link-exact-active {
            background-color: cornflowerblue;
            color: white;
        }
    }
}
</style>
