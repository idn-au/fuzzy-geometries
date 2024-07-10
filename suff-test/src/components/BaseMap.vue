<script setup lang="ts">
import { provide, ref } from "vue";
import { Map, Layers, Sources, MapControls, Interactions, type Vue3OpenlayersGlobalOptions } from "vue3-openlayers";
import type Feature from "ol/feature";
import { SelectEvent } from "ol/interaction/Select";
import { getCenter } from "ol/extent";
import { click } from "ol/events/condition";
import BaseMapTooltip from "@/components/BaseMapTooltip.vue";

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
    focusSourceRef?: InstanceType<typeof Sources.OlSourceVector> | null;
    tooltip?: boolean;
}>(), {
    center: [142.73256587527243, -20.795353456464383], // QLD
    projection: "EPSG:4326",
    zoom: 5,
    rotation: 0,
    height: "460px",
    width: "100%",
    tooltip: false
});

const selectedFeature = ref<Feature | null>(null);
const selectedPosition = ref<number[]>([]);
const viewRef = ref<InstanceType<typeof Map.OlView> | null>(null);
const clickSelectRef = ref<InstanceType<typeof Interactions.OlInteractionSelect> | null>(null);

defineExpose({ fitToExtent });

function fitToExtent() {
    if (props.focusSourceRef && viewRef.value) {
        const extent = props.focusSourceRef.source.getExtent();
        viewRef.value.view.fit(extent, {
            maxZoom: 20,
            padding: [32, 32, 32, 32]
        });
    }
}

function escapeOverlay() {
    if (clickSelectRef.value && selectedFeature.value) {
        clickSelectRef.value.select.getFeatures().clear();
        selectedFeature.value = null;
    }
}

function featureClick(e: SelectEvent) {
    if (e.selected.length === 1) {
        selectedFeature.value = e.selected[0];
        selectedPosition.value = getCenter(e.selected[0].getGeometry()!.getExtent());
    } else {
        selectedFeature.value = null;
    }
}
</script>

<template>
    <Map.OlMap :loadTilesWhileAnimating="true" :loadTilesWhileInteracting="true" :style="{ height: props.height, width: props.width }">
        <Map.OlView ref="viewRef" :center="props.center" :rotation="props.rotation" :zoom="props.zoom" :projection="props.projection" />
        <slot name="tiles">
            <Layers.OlTileLayer title="OpenStreetMap">
                <Sources.OlSourceOsm />
            </Layers.OlTileLayer>
        </slot>
        <slot name="layers" />

        <Interactions.OlInteractionSelect v-if="props.tooltip" :condition="click" @select="featureClick" ref="clickSelectRef"></Interactions.OlInteractionSelect>
        <slot name="interactions" />

        <Map.OlOverlay v-if="props.tooltip && selectedFeature" :position="selectedPosition" positioning="bottom-center" :stopEvent="true">
            <template v-slot="slotProps">
                <BaseMapTooltip :selectedFeature="(selectedFeature as Feature)" @deselect="escapeOverlay"/>
            </template>
        </Map.OlOverlay>
        <slot name="overlays" />
        <slot name="controls" />
        <MapControls.OlLayerswitcherControl />
        <MapControls.OlFullscreenControl />
        <MapControls.OlScalelineControl />
        <MapControls.OlZoomsliderControl />
    </Map.OlMap>
</template>
