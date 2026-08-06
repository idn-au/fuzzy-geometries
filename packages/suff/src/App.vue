<script lang="ts" setup>
import { Moon, Sun, SunMoon } from "@lucide/vue";
import { useColorMode } from "@vueuse/core";
import { ref } from "vue";
import FuzzyMap from "./components/FuzzyMap.vue";
import Map from "./components/Map.vue";
import { Button } from "./components/ui/button";
import { ButtonGroup } from "./components/ui/button-group";
import { Input } from "./components/ui/input";
import { RINGS_FC, TEST_TURTLE_DATA_ORDINAL } from "./data";
import { convert } from "./suff";

const colorMode = useColorMode();

const featureCollection = ref(null);
const gridSpacing = ref(2);
const contourCount = ref(50);
// const features = ref<FeatureCollection>({type: "FeatureCollection", features: []});
const layers = ref([
    {
        title: "My first layer",
        type: "FeatureCollection",
        features: [
            {
                type: "Feature",
                geometry: {
                    type: "Polygon",
                    coordinates: [
                        [
                            [
                                126.27725328998449,
                                -11.2119,
                            ],
                            [
                                126.54110713315218,
                                -26.68065,
                            ],
                            [
                                142.72414284743792,
                                -19.209946875,
                            ],
                            [
                                126.27725328998449,
                                -11.2119,
                            ],
                        ],
                    ],
                },
                properties: { key: "value", iri: "https://example.com" },
            },
            {
                geometry: "POLYGON((154.68551707104038 -23.86815,148.26507355395964 -24.483384375,148.52892739712735 -30.284165625,156.18068884899068 -30.108384375,154.68551707104038 -23.86815))",
                properties: {},
            },
        ],
    },
    {
        title: "My second layer",
        features: [
            {
                geometry: "POLYGON((131.114573748059 -28.26268125,131.46637887228263 -36.8759625,135.14123968177762 -31.533714202270183,139.36290117246085 -36.71926107727018,139.01109604823728 -26.699729827270183,134.70148327649812 -29.600120452270183,131.114573748059 -28.26268125))",
                properties: { key: "value2" },
            },
        ],
    },
]);
// const features = ref({features: ["POLYGON((118.71344311917703 -15.694321875,119.85680977290373 -27.295884375,133.92901474184782 -20.0009625,118.71344311917703 -15.694321875))"]});
const features = ref({ features: [{ geometry: "POLYGON((118.71344311917703 -15.694321875,119.85680977290373 -27.295884375,133.92901474184782 -20.0009625,118.71344311917703 -15.694321875))", id: 0 }] });

const drawFormat = ref<"GeoJSON" | "WKT">("WKT");

async function setupLoadTurtleOrdinal() {
    featureCollection.value = await convert(TEST_TURTLE_DATA_ORDINAL, "text/turtle");
}

const isFuzzy = false;
</script>

<template>
    <div>
        <header class="flex flex-row items-center gap-2 justify-between p-2">
            <Button variant="ghost" size="icon" class="ml-auto" @click="colorMode = colorMode === 'auto' ? 'light' : (colorMode === 'light' ? 'dark' : 'light')">
                <SunMoon v-if="colorMode === 'auto'" />
                <Moon v-else-if="colorMode === 'light'" />
                <Sun v-else />
            </Button>
        </header>
    </div>
    <div class="grid grid-cols-2 p-2 gap-4">
        <div>
            <div v-if="isFuzzy" class="flex flex-row items-end gap-2 pb-2">
                <div class="flex flex-row items-center gap-1">
                    <label>Grid Spacing</label>
                    <Input v-model="gridSpacing" type="number" min="1" class="max-w-32" />
                </div>
                <div class="flex flex-row items-center gap-1">
                    <label>No. Contours</label>
                    <Input v-model="contourCount" type="number" step="10" min="10" max="100" class="max-w-32" />
                </div>
            </div>
            <FuzzyMap v-if="isFuzzy" :features="RINGS_FC" :gridSpacing="gridSpacing" :contourCount="contourCount" />
            <Map
                v-else
                v-model:drawn="features"
                showToolbar
                enableDrawing
                :drawFormat="drawFormat"
                fitToData
            />
            <!--		<FuzzyMap :features="featureCollection" :gridSpacing="gridSpacing" :contourCount="contourCount" /> -->
            <!--		<BaseMap :layers="[RINGS_FC]" enableToolbar enableDrawing enableClearFeatures fitAddedLayersToExtent /> -->
            <!--		<BaseMap :layers="[featureCollection]" /> -->
        </div>
        <div>
            <template v-if="!isFuzzy">
                <div>
                    <label>Draw format</label>
                    <ButtonGroup>
                        <Button :variant="drawFormat === 'GeoJSON' ? 'default' : 'outline'" @click="drawFormat = 'GeoJSON'">
                            GeoJSON
                        </Button>
                        <Button :variant="drawFormat === 'WKT' ? 'default' : 'outline'" @click="drawFormat = 'WKT'">
                            WKT
                        </Button>
                    </ButtonGroup>
                </div>
                <pre class="whitespace-pre-wrap max-h-[500px] overflow-y-auto border p-2 rounded-md">{{ features }}</pre>
            </template>
            <!--			<div class="flex flex-row items-center gap-2"> -->
            <!--				<Button :disabled="featureCollection !== null" @click="setupLoadTurtleOrdinal">Load</Button> -->
            <!--				<Button variant="destructive" :disabled="featureCollection === null" @click="featureCollection = null">Clear</Button> -->
            <!--			</div> -->
            <!--			<pre class="whitespace-pre-wrap max-h-[500px] overflow-y-auto border p-2 rounded-md mt-2">{{featureCollection}}</pre> -->
        </div>
    </div>
</template>
