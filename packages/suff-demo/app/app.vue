<script lang="ts" setup>
import { ConfigProvider } from "reka-ui";

const useIdFunction = () => useId();
</script>

<template>
	<ConfigProvider :use-id="useIdFunction">
		<NuxtPage />
	</ConfigProvider>
</template>
