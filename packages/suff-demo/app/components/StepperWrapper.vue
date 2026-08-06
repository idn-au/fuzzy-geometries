<script setup lang="ts">
import { Check, ChevronLeft, ChevronRight, Circle, Dot } from "@lucide/vue";

const props = withDefaults(defineProps<{
    steps: {
        title: string;
        description?: string;
    }[];
    numbered?: boolean;
    // orientation?: "horizontal" | "vertical";
    linear?: boolean;
}>(), {
    // orientation: "vertical",
});

const stepIndex = defineModel<number>({ default: 1 });
</script>

<template>
    <div>
        <Stepper
            v-slot="{ nextStep, prevStep, isFirstStep, isLastStep }"
            v-model="stepIndex"
            orientation="vertical"
            :linear="props.linear"
            class="flex w-full flex-col justify-start gap-10"
        >
            <StepperItem
                v-for="(step, index) in props.steps"
                :key="index"
                v-slot="{ state }"
                class="relative flex w-full items-start gap-6"
                :step="index + 1"
            >
                <StepperSeparator
                    v-if="index + 1 !== steps.length"
                    class="absolute left-[18px] top-[38px] block h-[105%] w-0.5 shrink-0 rounded-full bg-muted group-data-[state=completed]:bg-primary"
                />

                <StepperTrigger asChild>
                    <Button
                        :variant="state === 'completed' || state === 'active' ? 'default' : 'outline'"
                        size="icon"
                        class="z-10 rounded-full shrink-0"
                        :class="[state === 'active' && 'ring-2 ring-ring ring-offset-2 ring-offset-background']"
                    >
                        <template v-if="props.numbered">
                            {{ index + 1 }}
                        </template>
                        <template v-else>
                            <Check v-if="state === 'completed'" class="size-5" />
                            <Circle v-if="state === 'active'" />
                            <Dot v-if="state === 'inactive'" />
                        </template>
                    </Button>
                </StepperTrigger>

                <div class="flex flex-col gap-1 w-full">
                    <StepperTrigger class="w-min" asChild>
                        <StepperTitle
                            :class="`text-sm font-semibold transition lg:text-base cursor-pointer ${state === 'active' ? 'text-primary' : 'hover:text-muted-foreground'}`"
                        >
                            {{ step.title }}
                        </StepperTitle>
                    </StepperTrigger>
                    <StepperDescription v-if="step.description">
                        {{ step.description }}
                    </StepperDescription>
                    <div v-if="state === 'active'">
                        <slot :stepIndex="stepIndex" />
                    </div>
                </div>
            </StepperItem>
        </Stepper>
        <div class="flex flex-row items-center gap-2 justify-between sticky bottom-0 p-2 bg-background z-10">
            <div class="flex flex-row items-center gap-2 ">
                <Button v-if="stepIndex > 1" variant="outline" @click="stepIndex -= 1">
                    <ChevronLeft /> Prev
                </Button>
                <slot name="left-buttons" />
            </div>
            <div class="flex flex-row items-center gap-2 ">
                <slot name="right-buttons" />
                <Button v-if="stepIndex < props.steps.length" variant="outline" @click="stepIndex += 1">
                    Next <ChevronRight />
                </Button>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
