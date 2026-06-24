<script setup lang="ts">
import { Locate, X, GripHorizontal } from "@lucide/vue";

const geometries = ref([
	{
		title: "",
		uncertainty: null,
	},
	{
		title: "",
		uncertainty: null,
	},
]);
</script>

<template>
	<div class="flex flex-col gap-2">
		<div v-for="(geom, index) in geometries" class="flex flex-row items-center gap-2">
			<div class="text-muted-foreground cursor-grab">
				<GripHorizontal />
			</div>
			<Button variant="ghost" size="icon-sm">
				<Locate />
			</Button>
			<Input type="text" v-model="geometries[index].title" placeholder="Title" />
			<Input type="number" v-model="geometries[index].uncertainty" placeholder="Uncertainty" />
			<Button variant="destructive" size="icon-sm" class="ml-auto"><X /></Button>
		</div>
	</div>
</template>

<style scoped>

</style>