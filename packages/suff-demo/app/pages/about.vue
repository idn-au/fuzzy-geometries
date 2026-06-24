<script setup lang="ts">
import { Map, FuzzyMap, generateContours, generateGeomExtremes, generateInterpolatedGrid, generateTIN } from "suff";
import { RINGS_FC } from "~/utils/data";

const steps = [
	{
		title: "Define Geometries",
	},
	{
		title: "Create 0 & 1 Boundaries",
	},
	{
		title: "TIN Network",
	},
	{
		title: "Point Grid",
	},
	{
		title: "Contours",
	},
	{
		title: "Opacity",
	},
];

const extremes = generateGeomExtremes(RINGS_FC);
const triangles = generateTIN(extremes);
const grid = generateInterpolatedGrid(extremes, triangles, 2);
const contours = generateContours(RINGS_FC, 2, 20);

const dataArray = [RINGS_FC, extremes, triangles, grid, contours];

const stepIndex = ref(1);
const data = computed(() => dataArray.slice(0, stepIndex.value));
</script>

<template>
	<NuxtLayout>
		<template #title>About Fuzzy Geometries</template>
		<template #description>
			Model for describing geometries with uncertainty
		</template>
		<p class="my-2">
			Use-cases - Indigenous areas, endangered species, etc.
		</p>
		<h2 class="text-2xl my-2">The SUFF Model</h2>
		<p class="my-2">
			See the spec here - <a href="https://w3id.org/suff" target="_blank">w3id.org/suff</a>
		</p>
		<div class="grid grid-cols-2 gap-4">
			<div>
				<p class="my-2">
					content on the left
				</p>
			</div>
			<img src="/img/model.png" class="mx-auto w-full max-w-[700px]" />
		</div>
		<h3 class="text-xl my-2">Modes</h3>
		<p class="my-2">
			Nominal, ordinal, interval &amp; ratio
		</p>
		<h2 class="text-2xl my-2">Software Implementation</h2>
		<p class="my-2">
			Available as an NPM package...
		</p>
		<p class="my-2">
			Explanation of map implementation with steps
		</p>
		<div class="grid grid-cols-2 gap-4 items-start">
			<StepperWrapper v-model="stepIndex" :steps="steps" numbered v-slot="{stepIndex}">
				<p v-if="stepIndex === 1">
					Define geometries & determine SUFF level of measurement (see above) - i.e. whether certainty values have been provided or need to be generated, and whether ordering has been specified.
				</p>
				<p v-else-if="stepIndex === 2">
					Create 0 & 1 certainty value boundaries if applicable based on the determined level of measurement.
				</p>
				<p v-else-if="stepIndex === 3">
					Create a TIN network across the geometries.
				</p>
				<p v-else-if="stepIndex === 4">
					Create a point grid to sample across the TIN network for certainty value estimates.
				</p>
				<p v-else-if="stepIndex === 5">
					Create contours based on the point samples.
				</p>
				<p v-else-if="stepIndex === 6">
					Display the contours with opacity based on the certainty value to emulate a blurring effect.
				</p>
			</StepperWrapper>
			<div class="sticky top-[107.65px] md:top-[125.8px]">
				<ClientOnly>
					<Map v-if="stepIndex < 6" :data="data" fitToData :animate="false" />
					<FuzzyMap v-else :features="RINGS_FC" :contourCount="20" />
				</ClientOnly>
			</div>
		</div>
	</NuxtLayout>
</template>

<style scoped>

</style>