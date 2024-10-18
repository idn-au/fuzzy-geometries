<script lang="ts" setup>
import { ref, computed, watch } from "vue";
import { Layers, Sources, Styles, Interactions, MapControls } from "vue3-openlayers";
import { GeoJSON } from "ol/format";
import type { DrawEvent } from "ol/interaction/Draw";
import type { ModifyEvent } from "ol/interaction/Modify";
import type { Geometry, FeatureCollection } from "geojson";
import type Feature from "ol/Feature";
import BaseMap from "@/components/BaseMap.vue";

const geoJson = new GeoJSON();

const geometries = defineModel<Geometry[]>();

const isDrawing = ref(false);
const isModifying = ref(false);
const features = ref<Feature[]>([]);

const sourceRef = ref<InstanceType<typeof Sources.OlSourceVector> | null>(null);

const featureCollection = computed({
    get() {
        return geoJson.readFeatures({
            type: "FeatureCollection",
            features: geometries.value?.map(g => {
                return {
                    type: "Feature",
                    geometry: g
                }
            }),
        });
    },
    set(newValue) {
        geometries.value = (JSON.parse(geoJson.writeFeatures(newValue)) as FeatureCollection).features.map(f => f.geometry);
    }
});

watch(features, (newValue, oldValue) => {
    featureCollection.value = newValue;
}, { deep: true });

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
    features.value.push(f);
}

function modifyend(e: ModifyEvent) {
    if (sourceRef.value) {
        const modifiedFeature = e.features.item(0);
        console.log(modifiedFeature)
        const id = modifiedFeature.getId()! as number;
        features.value[id].setGeometry(modifiedFeature.getGeometry()!);
    }
}
</script>

<template>
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
    <div>
        <h2>features</h2>
        {{ features }}
    </div>
    <div>
        <h2>featureCollection</h2>
        {{ featureCollection }}
    </div>
</template>

<style lang="scss" scoped>

</style>