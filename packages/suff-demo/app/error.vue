<script setup lang="ts">
import type { NuxtError } from "#app";

const props = defineProps<{
    error: NuxtError;
}>();

// const handleError = () => clearError({ redirect: "/" });
</script>

<template>
    <NuxtLayout>
        <div>
            <h2>{{ props.error.statusCode }}: {{ props.error.statusMessage }}</h2>
            <p>{{ props.error.message }}</p>
            <div class="overflow-auto">
                <pre>{{ props.error.stack }}</pre>
            </div>
            <Button as-child>
                <NuxtLink to="/">Go home</NuxtLink>
            </Button>
        </div>
    </NuxtLayout>
</template>
