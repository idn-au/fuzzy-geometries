<script setup lang="ts">
import { provide } from "vue";
import { Map, Layers, Sources, MapControls, type Vue3OpenlayersGlobalOptions } from "vue3-openlayers";

const options: Vue3OpenlayersGlobalOptions = {
    debug: false,
};

provide("ol-options", options);

const props = withDefaults(defineProps<{
    center?: number[];
    projection?: string;
    zoom?: number;
    rotation?: number;
    height?: string;
    width?: string;
}>(), {
    center: [142.73256587527243, -20.795353456464383], // QLD
    projection: "EPSG:4326",
    zoom: 5,
    rotation: 0,
    height: "460px",
    width: "100%",
});
</script>

<template>
    <Map.OlMap :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" :style="{ height: props.height, width: props.width }">
        <Map.OlView :center="props.center" :rotation="props.rotation" :zoom="props.zoom" :projection="props.projection" />
        <slot name="tiles">
            <Layers.OlTileLayer title="OpenStreetMap">
                <Sources.OlSourceOsm />
            </Layers.OlTileLayer>
        </slot>
        <slot name="layers" />
        <slot name="interactions" />
        <slot name="overlays" />
        <MapControls.OlLayerswitcherControl />
        <MapControls.OlFullscreenControl />
        <MapControls.OlScalelineControl />
        <MapControls.OlZoomsliderControl />
        <slot name="controls" />
    </Map.OlMap>
</template>
