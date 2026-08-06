<script setup lang="ts">
import { GripHorizontal, Locate, X } from "@lucide/vue";

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
            <Input v-model="geometries[index].title" type="text" placeholder="Title" />
            <Input v-model="geometries[index].uncertainty" type="number" placeholder="Uncertainty" />
            <Button variant="destructive" size="icon-sm" class="ml-auto">
                <X />
            </Button>
        </div>
    </div>
</template>

<style scoped>

</style>
