<script lang="ts" setup>
import { ref, computed } from "vue";
import { parse, type FeatColl } from "suff-rdf";
import { TEST_TURTLE_DATA_NOMINAL, TEST_JSONLD_DATA_NOMINAL, TEST_TURTLE_DATA_RATIO } from "@/util/data";
import SuffMap from "@/components/SuffMap.vue";

const data = ref("");
const featureCollection = ref<FeatColl>({
    type: "FeatureCollection",
    features: [],
});

async function loadTurtleNominal() {
    data.value = TEST_TURTLE_DATA_NOMINAL;
    featureCollection.value = await parse(TEST_TURTLE_DATA_NOMINAL, "text/turtle");
}

async function loadJSONLDNominal() {
    data.value = TEST_JSONLD_DATA_NOMINAL;
    featureCollection.value = await parse(TEST_JSONLD_DATA_NOMINAL, "application/json-ld");
}

async function loadTurtleRatio() {
    data.value = TEST_TURTLE_DATA_RATIO;
    featureCollection.value = await parse(TEST_TURTLE_DATA_RATIO, "text/turtle");
}

function handleClear() {
    data.value = "";
    featureCollection.value = {
        type: "FeatureCollection",
        features: [],
    };
}
</script>

<template>
    <h1>SUFF RDF Conversion</h1> 
    <div class="buttons">
        <button @click="loadTurtleNominal">Load Turtle Nominal</button>
        <button @click="loadJSONLDNominal">Load JSON-LD Nominal</button>
        <button @click="loadTurtleRatio">Load Turtle Ratio</button>
        <button @click="handleClear">Clear</button>
    </div>
    <div class="content">
        <div class="col">
            <h2>Data</h2>
            <div class="data">
                <pre>{{ data }}</pre>
            </div>
        </div>
        <div class="col">
            <h2>Output</h2>
            <div class="data">
                <pre>{{ JSON.stringify(featureCollection, null, 4) }}</pre>
            </div>
        </div>
    </div>
    <SuffMap :featureCollection="featureCollection" />
</template>

<style lang="scss" scoped>
.buttons {
    display: flex;
    flex-direction: row;
    gap: 8px;
}

.content {
    display: flex;
    flex-direction: row;
    height: 500px;

    .col {
        flex: 1;
        padding: 8px;
        display: flex;
        flex-direction: column;

        .data {
            overflow-y: auto;

            pre {
                white-space: pre-wrap;
                
            }
        }
    }
}
</style>