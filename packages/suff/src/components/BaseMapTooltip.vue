<script lang="ts" setup>
import { onMounted, onUnmounted, computed } from "vue";
import { X, Focus } from "@lucide/vue";
import type Feature from "ol/Feature";
import Geometry from "ol/geom/Geometry";
import {Button} from "@/components/ui/button";

const props = defineProps<{
    feature: Feature<Geometry>;
}>();

const properties = computed(() => {
	return props.feature.getProperties().properties;
})

const emit = defineEmits<{
	deselect: [];
	deselectAll: [];
	focus: [];
}>();

function deselect() {
    emit("deselect");
}

function onEscape(e: KeyboardEvent) {
    if (e.key === "Escape") {
	    emit("deselectAll");
    }
}

function handleFocus() {
	emit("focus");
}

onMounted(() => {
    document.addEventListener("keyup", onEscape);
});

onUnmounted(() => {
    document.removeEventListener("keyup", onEscape);
});
</script>

<template>
	<div class="bg-background p-3 rounded-md shadow-md flex flex-col gap-2 max-w-lg mb-2 map-tooltip">
		<div class="flex flex-row gap-2 items-center">
			<span class="font-bold grow"><slot name="title"></slot></span>
			<div class="flex flex-row items-center gap-2">
				<Button variant="ghost" size="icon" class="" aria-label="Select and zoom" title="Select and zoom" @click="handleFocus">
					<Focus class="size-4" />
				</Button>
				<Button variant="ghost" size="icon" class="" aria-label="Close" title="Close" @click="deselect">
					<X class="size-4" />
				</Button>
			</div>
		</div>
		<slot name="properties" :properties="properties">
			<div class="font-mono text-sm">
<!--				<pre>{{props.feature.getProperties()}}</pre>-->
				<div v-for="(value, key) in properties" class="p-1 odd:bg-accent">{{ key }}: {{ value }}</div>
			</div>
		</slot>
	</div>
</template>

<style scoped>
/* for tooltip arrow */
.map-tooltip::after {
	content: " ";
	position: absolute;
	top: calc(100% - 1px - 8px);
	left: 50%;
	margin-left: -8px;
	border-width: 8px;
	border-style: solid;
	border-color: var(--color-background) transparent transparent transparent;
}
</style>
