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
            <h2>{{ props.error.status }}: {{ props.error.statusText }}</h2>
            <p>{{ props.error.message }}</p>
            <div class="overflow-auto">
                <pre>{{ props.error.stack }}</pre>
            </div>
            <Button asChild>
                <NuxtLink to="/">
                    Go home
                </NuxtLink>
            </Button>
        </div>
    </NuxtLayout>
</template>
