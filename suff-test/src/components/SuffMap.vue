<script lang="ts" setup>
import { computed, nextTick, onMounted, ref, watch } from "vue";
import { Layers, Sources, Styles } from "vue3-openlayers";
import type { Style } from "ol/style";
import { GeoJSON } from "ol/format";
import type { FeatColl } from "suff-rdf";
import type { FeatureLike } from "ol/Feature";
import BaseMap from "@/components/BaseMap.vue";

const props = defineProps<{
    featureCollection: FeatColl;
}>();

const geoJson = new GeoJSON();

const baseMapRef = ref<InstanceType<typeof BaseMap> | null>(null);
const focusSourceRef = ref<InstanceType<typeof Sources.OlSourceVector> | null>(null); // the source to centre on

const features = computed(() => geoJson.readFeatures(props.featureCollection));

function styleFunction(feature: FeatureLike, style: Style) {
    style.getFill()?.setColor(`rgba(0, 0, 255, ${feature.get("certainty")})`);
    return style;
}

watch(() => props.featureCollection, (newValue) => {
    nextTick(() => {
        if (baseMapRef.value) {
            baseMapRef.value.fitToExtent();
        }
    });
}, { deep: true });

onMounted(() => {
    nextTick(() => {
        if (baseMapRef.value) {
            baseMapRef.value.fitToExtent();
        }
    });
});
</script>

<template>
    <BaseMap ref="baseMapRef" :focusSourceRef="focusSourceRef">
        <template #layers>
            <Layers.OlVectorLayer name="Feature">
                <!-- @vue-ignore -->
                <Sources.OlSourceVector ref="focusSourceRef" :format="geoJson" :features="features">
                    <Styles.OlStyle :overrideStyleFunction="styleFunction">
                        <Styles.OlStyleFill color="blue"></Styles.OlStyleFill>
                        <Styles.OlStyleStroke color="blue" :width="2"></Styles.OlStyleStroke>
                    </Styles.OlStyle>
                </Sources.OlSourceVector>
            </Layers.OlVectorLayer>
        </template>
    </BaseMap>
</template>

<style lang="scss" scoped></style>