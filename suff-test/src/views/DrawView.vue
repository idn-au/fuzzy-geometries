<script lang="ts" setup>
import { ref } from "vue";
import type { Geometry } from "geojson";
// import DrawMap from "@/components/DrawMap.vue";
import DrawMapOld from "@/components/DrawMapOld.vue";
// import DrawInput from "@/components/DrawInput.vue";

const geometries = ref<Geometry[]>([]);
</script>

<template>
    <h1>Draw geometries</h1>
    <DrawMapOld/>
    <!-- <div class="draw-view">
        <DrawMap v-model="geometries" />
        <DrawInput v-model="geometries" />
    </div>
    <div>
        <h2>geometries</h2>
        <pre>{{ JSON.stringify(geometries, null, 2) }}</pre>
    </div> -->
</template>

<style lang="scss" scoped>
.draw-view {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
}
</style>