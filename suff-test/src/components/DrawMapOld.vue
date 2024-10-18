<script lang="ts" setup>
import { ref, computed } from "vue";
import { Layers, Sources, Styles, Interactions, MapControls, Map } from "vue3-openlayers";
import { GeoJSON } from "ol/format";
import type { DrawEvent } from "ol/interaction/Draw";
import { geojsonToWKT } from "@terraformer/wkt";
import type { ModifyEvent } from "ol/interaction/Modify";
import BaseMap from "@/components/BaseMap.vue";

const geoJson = new GeoJSON();

const isWkt = ref(true);
const features = ref<any[]>([])
const isDrawing = ref(false);
const isModifying = ref(false);

const sourceRef = ref<InstanceType<typeof Sources.OlSourceVector> | null>(null);

const geometries = computed(() => features.value.map(f => isWkt.value ? geojsonToWKT(f.geometry) : f.geometry));

const featureCollection = computed(() => {
    return geoJson.readFeatures({
        type: "FeatureCollection",
        features: features.value,
    });
});

function toggleDrawControl(active: boolean) {
    if (active) {
        isModifying.value = false;
    }
    isDrawing.value = active;
}

function toggleModifyControl(active: boolean) {
    if (active) {
        isDrawing.value = false;
    }
    isModifying.value = active;
}

function drawend(e: DrawEvent) {
    const f = e.feature;
    f.setId(features.value.length);
    features.value.push(JSON.parse(geoJson.writeFeature(f)));
}

function modifyend(e: ModifyEvent) {
    if (sourceRef.value) {
        const modifiedFeature = e.features.item(0);
        const id = modifiedFeature.getId()! as number;
        features.value[id].geometry = JSON.parse(geoJson.writeGeometry(modifiedFeature.getGeometry()!));
    }
}
</script>

<template>
    <div class="draw-map">
        <div class="map">
            <BaseMap :center="[153.01197617738202, -27.483980475242785]" :zoom="10">
                <template #layers>
                    <Layers.OlVectorLayer title="Features">
                         <!-- @vue-ignore -->
                        <Sources.OlSourceVector ref="sourceRef" :features="featureCollection">
                            <Interactions.OlInteractionDraw v-if="isDrawing" type="Polygon" @drawend="drawend">
                                <Styles.OlStyle>
                                    <Styles.OlStyleStroke color="blue" :width="2"></Styles.OlStyleStroke>
                                    <Styles.OlStyleCircle :radius="6">
                                        <Styles.OlStyleFill color="lightblue"></Styles.OlStyleFill>
                                        <Styles.OlStyleStroke :width="1" color="white"></Styles.OlStyleStroke>
                                    </Styles.OlStyleCircle>
                                </Styles.OlStyle>
                            </Interactions.OlInteractionDraw>
                            <Interactions.OlInteractionModify v-if="isModifying" @modifyend="modifyend">
                                <Styles.OlStyle>
                                    <Styles.OlStyleStroke color="blue" :width="2"></Styles.OlStyleStroke>
                                    <Styles.OlStyleCircle :radius="6">
                                        <Styles.OlStyleFill color="lightblue"></Styles.OlStyleFill>
                                        <Styles.OlStyleStroke :width="1" color="white"></Styles.OlStyleStroke>
                                    </Styles.OlStyleCircle>
                                </Styles.OlStyle>
                            </Interactions.OlInteractionModify>
                        </Sources.OlSourceVector>
                    </Layers.OlVectorLayer>
                </template>
                <template #controls>
                    <MapControls.OlControlBar>
                        <MapControls.OlToggleControl html="D" title="Draw" :onToggle="toggleDrawControl" />
                        <MapControls.OlToggleControl html="E" title="Edit" :onToggle="toggleModifyControl" />
                    </MapControls.OlControlBar>
                </template>
            </BaseMap>
        </div>
        <div class="data">
            <h2>Features</h2>
            <div class="buttons">
                <button :class="`format-btn ${isWkt ? 'active' : ''}`" @click="isWkt = true">WKT</button>
                <button :class="`format-btn ${isWkt ? '' : 'active'}`" @click="isWkt = false">GeoJSON</button>
            </div>
            <div>
                <pre>{{ JSON.stringify(geometries, null, 4) }}</pre>
            </div>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.draw-map {
    display: grid;
    grid-template-columns: repeat(2, 1fr);

    .map {

    }

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
        pre {
            white-space: pre-wrap;
        }
    }
}
</style>