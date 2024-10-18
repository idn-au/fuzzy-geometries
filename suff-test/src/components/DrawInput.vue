<script lang="ts" setup>
import { computed, ref } from "vue";
import { geojsonToWKT, wktToGeoJSON } from "@terraformer/wkt";
import type { Feature } from "geojson";

const features = defineModel<Feature[]>();

const isWkt = ref(true);

const geojson = computed({
    get() {
        return JSON.stringify(features.value, null, 2);
    },
    set(newValue) {
        features.value = JSON.parse(newValue);
    }
});
const wkt = computed({
    get() {
        return geojsonToWKT(features.value);
    },
    set(newValue) {
        features.value = wktToGeoJSON(newValue);
    }
});
</script>

<template>
    <div class="data">
        <h2>Features</h2>
        <div class="buttons">
            <button :class="`format-btn ${isWkt ? 'active' : ''}`" @click="isWkt = true">WKT</button>
            <button :class="`format-btn ${isWkt ? '' : 'active'}`" @click="isWkt = false">GeoJSON</button>
        </div>
        <div>
            <textarea v-if="isWkt" name="" id="" v-model="wkt"></textarea>
            <textarea v-else name="" id="" v-model="geojson"></textarea>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.data {
    .buttons {
        display: flex;
        flex-direction: row;
        
        .format-btn {
            border: none;
            background-color: #eaeaea;
            cursor: pointer;
            padding: 6px 8px;
            
            &.active {
                background-color: cornflowerblue;
                color: white;
            }
        }
    }
}
</style>