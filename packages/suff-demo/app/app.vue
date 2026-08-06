<script lang="ts" setup>
import { ConfigProvider } from "reka-ui";

const useIdFunction = () => useId();
</script>

<template>
    <ConfigProvider :useId="useIdFunction">
        <NuxtPage />
    </ConfigProvider>
</template>
