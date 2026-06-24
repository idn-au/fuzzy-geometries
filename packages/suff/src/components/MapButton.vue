<script setup lang="ts">
import type {HTMLAttributes} from "vue";
import {cn} from "@/lib/utils";
import {TooltipProvider, Tooltip, TooltipTrigger, TooltipContent} from "@/components/ui/tooltip";
import {Button, type ButtonVariants} from "@/components/ui/button";

const props = withDefaults(defineProps<{
	// variant?: ButtonVariants["variant"];
	size?: ButtonVariants["size"];
	active?: boolean;
	tooltip?: string;
	tooltipSide?: "top" | "right" | "bottom" | "left";
	asChild?: boolean;
	class?: HTMLAttributes["class"];
}>(), {
	// variant: "default",
	size: "default",
	tooltipSide: "top",
});

const emit = defineEmits<{
	click: [e: MouseEvent];
}>();

const btnClass = "absolute z-[1]";
</script>

<template>
	<TooltipProvider v-if="props.tooltip">
		<Tooltip>
			<TooltipTrigger as-child>
				<Button
					:size="props.size"
					:variant="props.active ? 'default' : 'outline'"
					:class="cn(btnClass, props.active ? '' : '!bg-background hover:!bg-accent', props.class)"
					:asChild="props.asChild"
					@click="emit('click', $event)"
				>
					<slot />
				</Button>
			</TooltipTrigger>
			<TooltipContent :side="props.tooltipSide">
				<p>{{props.tooltip}}</p>
			</TooltipContent>
		</Tooltip>
	</TooltipProvider>
	<Button
		v-else
		:size="props.size"
		:variant="props.active ? 'default' : 'outline'"
		:class="cn(btnClass, props.class)"
		:asChild="props.asChild"
		@click="emit('click', $event)"
	>
		<slot />
	</Button>
</template>
