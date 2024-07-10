<script lang="ts" setup>
import { computed, nextTick, onMounted, ref } from "vue";
import { Layers, Sources, Styles } from "vue3-openlayers";
import { GeoJSON } from "ol/format";
import { polygonToLine } from "@turf/turf";
import BaseMap from "@/components/BaseMap.vue";

const geoJson = new GeoJSON();

const featureCollection = {
    type: "FeatureCollection",
    features: [
        {
            "type": "Feature",
            "properties": {
                "certainty": "0.75",
                "label": "Test nominal feature"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            153.0370565511827,
                            -27.37978201943224
                        ],
                        [
                            152.96422039713153,
                            -27.422354040916616
                        ],
                        [
                            152.96696893124667,
                            -27.55007010536974
                        ],
                        [
                            153.0769102958522,
                            -27.595388708885366
                        ],
                        [
                            153.14699791578823,
                            -27.49788504677599
                        ],
                        [
                            153.13188097815498,
                            -27.405874548729116
                        ],
                        [
                            153.0370565511827,
                            -27.37978201943224
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {
                "certainty": "1",
                "label": "Test nominal feature"
            },
            "geometry": {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            153.0411793523554,
                            -27.455313025291616
                        ],
                        [
                            153.02056534649185,
                            -27.471792517479116
                        ],
                        [
                            153.02606241472213,
                            -27.504751501854116
                        ],
                        [
                            153.06041909116138,
                            -27.50887137490099
                        ],
                        [
                            153.0727874946795,
                            -27.477285681541616
                        ],
                        [
                            153.06041909116138,
                            -27.45943289833849
                        ],
                        [
                            153.0411793523554,
                            -27.455313025291616
                        ]
                    ]
                ]
            }
        }

    ]
}

const baseMapRef = ref<InstanceType<typeof BaseMap> | null>(null);
const focusSourceRef = ref<InstanceType<typeof Sources.OlSourceVector> | null>(null); // the source to centre on

const features = computed(() => geoJson.readFeatures(featureCollection));

const t = computed(() => {
    const fObj = geoJson.writeFeatureObject(features.value[1]);
    const line = polygonToLine(fObj);
    console.log(line)


    return geoJson.readFeature(line);
})

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
                    <Styles.OlStyle>
                        <Styles.OlStyleFill color="rgba(255, 255, 255, 0.6)"></Styles.OlStyleFill>
                        <Styles.OlStyleStroke color="blue" :width="2"></Styles.OlStyleStroke>
                    </Styles.OlStyle>
                </Sources.OlSourceVector>
            </Layers.OlVectorLayer>
            <Layers.OlVectorLayer name="Generated">
                <!-- @vue-ignore -->
                <Sources.OlSourceVector :format="geoJson" :features="[t]">
                    <Styles.OlStyle>
                        <Styles.OlStyleFill color="rgba(255, 255, 255, 0.6)"></Styles.OlStyleFill>
                        <Styles.OlStyleStroke color="red" :width="2"></Styles.OlStyleStroke>
                    </Styles.OlStyle>
                </Sources.OlSourceVector>
            </Layers.OlVectorLayer>
        </template>
    </BaseMap>
</template>
