<script setup lang="ts">
import { ChevronDown, Info, Upload } from "@lucide/vue";
import { Map, FuzzyMap } from "suff";
import {RINGS_FC} from "~/utils/data";
import {Editor} from "@kurrawongai/kai-ui";

const steps = [
	{
		title: "Load Data",
	},
	{
		title: "Assign Uncertainties",
	},
	{
		title: "Export",
	},
];

const modeOptions = [
	{
		label: "Nominal",
		value: "nominal",
	},
	{
		label: "Ordinal",
		value: "ordinal",
	},
	{
		label: "Interval",
		value: "interval",
	},
	{
		label: "Ratio",
		value: "ratio",
	},
];

const examples = [
	{
		title: "Rings",
		data: RINGS_FC,
	},
];

const colorMode = useColorMode();

const mapMode = ref<"data" | "fuzzy">("data");
const mode = ref(undefined);
const data = ref(RINGS_FC);

function loadExample(index: number) {
	data.value = examples[index].data;
}
</script>

<template>
	<NuxtLayout>
		<template #title>Fuzzy Geometries Playground</template>
		<template #description>
			Model for describing geometries with uncertainty
		</template>
		<p class="my-2">
			Description on what it is and how to use it
		</p>
		<div class="flex flex-row gap-2 items-center p-2 border-y bg-background">
			<Tabs class="mr-auto" v-model="mapMode">
				<TabsList class="grid grid-cols-2 w-full mx-auto max-w-xl">
					<TabsTrigger value="data">Data</TabsTrigger>
					<TabsTrigger value="fuzzy">Fuzzy</TabsTrigger>
				</TabsList>
			</Tabs>
<!--			<Button variant="destructive">Clear</Button>-->
<!--			<div class="flex flex-row gap-2 items-center">-->
<!--				<Select v-model="mode">-->
<!--					<SelectTrigger>-->
<!--						<SelectValue placeholder="Mode" />-->
<!--					</SelectTrigger>-->
<!--					<SelectContent>-->
<!--						<SelectItem v-for="option in modeOptions" :value="option.value" :key="option.value">-->
<!--							{{ option.label }}-->
<!--						</SelectItem>-->
<!--					</SelectContent>-->
<!--				</Select>-->
<!--				<Dialog>-->
<!--					<DialogTrigger asChild>-->
<!--						<Button variant="ghost" size="icon">-->
<!--							<Info />-->
<!--						</Button>-->
<!--					</DialogTrigger>-->
<!--				</Dialog>-->
<!--			</div>-->
<!--			<DropdownMenu>-->
<!--				<DropdownMenuTrigger asChild>-->
<!--					<Button variant="outline">-->
<!--						Examples <ChevronDown />-->
<!--					</Button>-->
<!--				</DropdownMenuTrigger>-->
<!--				<DropdownMenuContent>-->
<!--					<DropdownMenuItem v-for="(example, index) in examples" @select="loadExample(index)">-->
<!--						{{example.title}}-->
<!--					</DropdownMenuItem>-->
<!--				</DropdownMenuContent>-->
<!--			</DropdownMenu>-->
		</div>
		<div class="grid grid-cols-2 gap-4 items-start bg-background pt-2">
			<div class="sticky top-[107.65px] md:top-[125.8px]">
				<ClientOnly>
					<Map
						v-if="mapMode === 'data'"
						:data="data"
						fitToData
						:animate="false"
					/>
					<FuzzyMap v-else :features="data" />
				</ClientOnly>
			</div>
			<Editor
				:modelValue="JSON.stringify(data, null, 4)"
				language="json"
				:theme="colorMode.value as ('light' | 'dark' | 'system')"
				hideLanguage
				hideTheme
				readonly
				class="h-[484px] rounded-lg"
			/>
<!--			<StepperWrapper :steps="steps" numbered v-slot="{stepIndex}">-->
<!--				<StepsLoad v-if="stepIndex === 1" v-model="data" />-->
<!--				<StepsUncertainties v-else-if="stepIndex === 2" />-->
<!--				<StepsExport v-else-if="stepIndex === 3" />-->
<!--			</StepperWrapper>-->
		</div>
	</NuxtLayout>
</template>
