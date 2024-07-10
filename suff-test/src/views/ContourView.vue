<script lang="ts" setup>
import { ref, computed, onMounted, nextTick } from "vue";
import { polygonToLine, explode, featureCollection, bbox, buffer, tin, pointGrid, tag, planepoint, pointToLineDistance, centroid, isobands } from "@turf/turf";
import { Layers, Sources, Styles } from "vue3-openlayers";
import { GeoJSON } from "ol/format";
import type { FeatureLike } from "ol/Feature";
import type Style from "ol/style/Style";
import BaseMap from "@/components/BaseMap.vue";

const geoJson = new GeoJSON();

const features = {
    type: "FeatureCollection",
    features: [
        {
            type: "Feature",
            geometry: {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            153.00568597491971,
                            -27.324237472821476
                        ],
                        [
                            153.03437843733306,
                            -27.325432992088697
                        ],
                        [
                            153.06665745754805,
                            -27.325432992088697
                        ],
                        [
                            153.09415440069415,
                            -27.336192665493694
                        ],
                        [
                            153.12165134384026,
                            -27.35412545450202
                        ],
                        [
                            153.13958413284857,
                            -27.362494089372575
                        ],
                        [
                            153.1575169218569,
                            -27.36488512790702
                        ],
                        [
                            153.18142730720135,
                            -27.376840320579237
                        ],
                        [
                            153.17066763379634,
                            -27.393577590320344
                        ],
                        [
                            153.16947211452913,
                            -27.41031486006145
                        ],
                        [
                            153.16708107599467,
                            -27.429443168337
                        ],
                        [
                            153.1790362686669,
                            -27.44498491881088
                        ],
                        [
                            153.18501386500301,
                            -27.462917707819212
                        ],
                        [
                            153.18860042280465,
                            -27.483241535361984
                        ],
                        [
                            153.195773538408,
                            -27.50715192070642
                        ],
                        [
                            153.17664523013244,
                            -27.537039902386965
                        ],
                        [
                            153.18620938427023,
                            -27.56573236480029
                        ],
                        [
                            153.17066763379634,
                            -27.589642750144726
                        ],
                        [
                            153.15871244112412,
                            -27.606380019885833
                        ],
                        [
                            153.12882445944356,
                            -27.64344111716971
                        ],
                        [
                            153.08937232362524,
                            -27.64344111716971
                        ],
                        [
                            153.05589778414304,
                            -27.65061423277304
                        ],
                        [
                            153.01764116759193,
                            -27.65539630984193
                        ],
                        [
                            152.98177558957528,
                            -27.651809752040265
                        ],
                        [
                            152.96503831983418,
                            -27.647027674971376
                        ],
                        [
                            152.92917274181752,
                            -27.631485924497493
                        ],
                        [
                            152.91004443354197,
                            -27.612357616221942
                        ],
                        [
                            152.89091612526641,
                            -27.581274115274173
                        ],
                        [
                            152.888525086732,
                            -27.543017498723074
                        ],
                        [
                            152.87776541332698,
                            -27.499978805103087
                        ],
                        [
                            152.87656989405977,
                            -27.47606841975865
                        ],
                        [
                            152.87656989405977,
                            -27.44857147661255
                        ],
                        [
                            152.8789609325942,
                            -27.425856610535334
                        ],
                        [
                            152.89091612526641,
                            -27.381622397648126
                        ],
                        [
                            152.92080410694697,
                            -27.362494089372575
                        ],
                        [
                            152.93993241522253,
                            -27.33858370402814
                        ],
                        [
                            152.97579799323918,
                            -27.325432992088697
                        ],
                        [
                            153.00568597491971,
                            -27.324237472821476
                        ]
                    ]
                ],
            },
            "properties": {
                "certainty": 0.25
            }
        },
        {
            "type": "Feature",
            geometry: {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            153.0061353252053,
                            -27.41823416786974
                        ],
                        [
                            153.0288115748328,
                            -27.41480094033068
                        ],
                        [
                            153.05973373341573,
                            -27.41823416786974
                        ],
                        [
                            153.08653293752093,
                            -27.433340369041616
                        ],
                        [
                            153.1050862326707,
                            -27.458059607322866
                        ],
                        [
                            153.1119578234669,
                            -27.488272009666616
                        ],
                        [
                            153.10920918714842,
                            -27.517797766502554
                        ],
                        [
                            153.09134305107827,
                            -27.55213004189318
                        ],
                        [
                            153.05973373341573,
                            -27.570669470604116
                        ],
                        [
                            153.0260629385143,
                            -27.57684928017443
                        ],
                        [
                            152.98483339373703,
                            -27.56654959755724
                        ],
                        [
                            152.9600956668707,
                            -27.540457068260366
                        ],
                        [
                            152.9497882806764,
                            -27.50818472939318
                        ],
                        [
                            152.9497882806764,
                            -27.482778845604116
                        ],
                        [
                            152.9566598714726,
                            -27.449819861229116
                        ],
                        [
                            152.97521316662235,
                            -27.432653723533804
                        ],
                        [
                            152.9868948709759,
                            -27.425100622947866
                        ],
                        [
                            153.0061353252053,
                            -27.41823416786974
                        ]
                    ]
                ],
            },
            "properties": {
                "certainty": 0.5
            }
        },
        {
            type: "Feature",
            geometry: {
                "type": "Polygon",
                "coordinates": [
                    [
                        [
                            153.00201237072753,
                            -27.46217948036974
                        ],
                        [
                            153.02262714311615,
                            -27.455313025291616
                        ],
                        [
                            153.050113506301,
                            -27.45943289833849
                        ],
                        [
                            153.0638566878934,
                            -27.474539099510366
                        ],
                        [
                            153.07072827868961,
                            -27.493765173729116
                        ],
                        [
                            153.0569850970972,
                            -27.51436453896349
                        ],
                        [
                            153.02949873391236,
                            -27.52809744911974
                        ],
                        [
                            152.9978894162498,
                            -27.515737829979116
                        ],
                        [
                            152.98689487097587,
                            -27.49239188271349
                        ],
                        [
                            152.99239214361288,
                            -27.47522574501818
                        ],
                        [
                            153.00201237072753,
                            -27.46217948036974
                        ]
                    ]
                ],
            },
            "properties": {
                "certainty": 0.75
            }
        }
    ]
};

const gridSpacing = ref(2);
const contourCount = ref(50);

const baseMapRef = ref<InstanceType<typeof BaseMap> | null>(null);
const focusSourceRef = ref<InstanceType<typeof Sources.OlSourceVector> | null>(null); // the source to centre on

const extremes = computed(() => {
    const fObj = structuredClone(features);
    fObj.features.sort((a, b) => a.properties.certainty - b.properties.certainty);

    const featureColl = featureCollection([]);

    if (fObj.features.length > 1) {
        // generate 0 certainty polygon - might need to be a buffer of the outline/union of all features?
        const lineFirst = polygonToLine(fObj.features[0], {
            properties: {
                certainty: fObj.features[0].properties["certainty"]
            }
        });

        const lineSecond = polygonToLine(fObj.features[1], {
            properties: {
                certainty: fObj.features[1].properties["certainty"]
            }
        });

        const zeroDistances = explode(lineSecond).features.map(f => pointToLineDistance(f, lineFirst));
        const zeroMeanDistance = zeroDistances.reduce((prev, curr) => prev + curr, 0) / zeroDistances.length;
        
        const polygonZero = buffer(fObj.features[0], zeroMeanDistance);
        polygonZero.properties.certainty = 0;

        featureColl.features.push(polygonZero);

        // generate 1 certainty polygon
        const lineSecondLast = polygonToLine(fObj.features[fObj.features.length - 2], {
            properties: {
                certainty: fObj.features[fObj.features.length - 2].properties["certainty"]
            }
        });

        const lineLast = polygonToLine(fObj.features[fObj.features.length - 1], {
            properties: {
                certainty: fObj.features[fObj.features.length - 1].properties["certainty"]
            }
        });

        const oneDistances = explode(lineLast).features.map(f => pointToLineDistance(f, lineSecondLast));
        const oneMeanDistance = oneDistances.reduce((prev, curr) => prev + curr, 0) / oneDistances.length;
        
        var polygonOne = buffer(fObj.features[fObj.features.length - 1], -oneMeanDistance);
        if (!polygonOne) {
            polygonOne = centroid(fObj.features[fObj.features.length - 1])
        }
        polygonOne.properties.certainty = 1;
        featureColl.features.push(polygonOne);
    }

    return featureColl;
});

const triangles = computed(() => {
    const fObj = structuredClone(features);
    const featureColl = featureCollection([]);

    fObj.features.forEach(f => {
        const line = polygonToLine(f, {
            properties: {
                certainty: f.properties["certainty"]
            }
        });
        
        const exp = explode(line);
        featureColl.features.push(...exp.features);
    });

    // do the same for generated 0 & 1 polygons
    extremes.value.features.forEach(f => {
        if (f.geometry.type === "Point") { // could be a point centroid
            featureColl.features.push(f);
        } else {
            const line = polygonToLine(f, {
                properties: {
                    certainty: f.properties["certainty"]
                }
            });
            
            const exp = explode(line);
            featureColl.features.push(...exp.features);
        }
    });

    const tinTriangles = tin(featureColl, "certainty");
    tinTriangles.features.forEach((f, index) => {
        f.properties.index = index;
    });

    return tinTriangles;
});

const grid = computed(() => {
    const pGrid = pointGrid(bbox(extremes.value), gridSpacing.value, {
        mask: extremes.value.features[0]
    });

    // create index to find the tin triangles the points are in and set triangulated planepoint
    const tagged = tag(pGrid, triangles.value, "index", "tin");
    tagged.features.forEach(f => {
        if (f.properties.tin) {
            f.properties.certainty = planepoint(f, triangles.value.features[f.properties.tin]);
        }
    });

    return tagged;
});

// reusing any previous logic breaks contours
const contours = computed(() => {
    const fObj = structuredClone(features);
    const featureColl = featureCollection([]);

    fObj.features.forEach(f => {
        const line = polygonToLine(f, {
            properties: {
                certainty: f.properties["certainty"]
            }
        });
        
        const exp = explode(line);
        featureColl.features.push(...exp.features);
    });

    // do the same for generated 0 & 1 polygons
    extremes.value.features.forEach(f => {
        if (f.geometry.type === "Point") { // could be a point centroid
            featureColl.features.push(f);
        } else {
            const line = polygonToLine(f, {
                properties: {
                    certainty: f.properties["certainty"]
                }
            });
            
            const exp = explode(line);
            featureColl.features.push(...exp.features);
        }
    });

    const tinTriangles = tin(featureColl, "certainty");
    tinTriangles.features.forEach((f, index) => {
        f.properties.index = index;
    });

    const pGrid = pointGrid(bbox(featureColl), gridSpacing.value);

    // create index to find the tin triangles the points are in and set triangulated planepoint
    const tagged = tag(pGrid, tinTriangles, "index", "tin");
    tagged.features.forEach(f => {
        if (f.properties.tin) {
            f.properties.certainty = planepoint(f, tinTriangles.features[f.properties.tin]);
        }
    });

    const isoTin = isobands(tagged, Array.from(Array(contourCount.value + 1), (_, x) => x / contourCount.value), {
        zProperty: "certainty"
    });

    isoTin.features.forEach(f => {
        f.properties.certainty = Number(f.properties.certainty.split("-")[0]);
    })

    return isoTin;
});

function styleFunction(feature: FeatureLike, style: Style) {
    style.getFill()?.setColor(`rgba(0, 0, 255, ${feature.get("certainty")})`);
    style.getStroke()?.setColor(`rgba(0, 0, 255, ${feature.get("certainty")**2})`);
    
    return style;
}

onMounted(() => {
    nextTick(() => {
        if (baseMapRef.value) {
            baseMapRef.value.fitToExtent();
        }
    });
});
</script>

<template>
    <div>
        <div>
            <label for="">Grid Spacing</label>
            <input type="number" name="" id="" min="1" v-model="gridSpacing">
        </div>
        <div>
            <label for="">Number of contours</label>
            <input type="number" name="" id="" step="10" min="10" v-model="contourCount">
        </div>
    </div>
    <BaseMap ref="baseMapRef" :focusSourceRef="focusSourceRef" tooltip height="600px" width="1000px">
        <template #layers>
            <Layers.OlVectorLayer name="Features" :visible="false">
                <!-- @vue-ignore -->
                <Sources.OlSourceVector :format="geoJson" :features="geoJson.readFeatures(features)">
                    <Styles.OlStyle :overrideStyleFunction="styleFunction">
                        <Styles.OlStyleFill color="blue"></Styles.OlStyleFill>
                        <Styles.OlStyleStroke color="blue" :width="2"></Styles.OlStyleStroke>
                    </Styles.OlStyle>
                </Sources.OlSourceVector>
            </Layers.OlVectorLayer>
            <Layers.OlVectorLayer name="Extremes" :visible="false">
                <!-- @vue-ignore -->
                <Sources.OlSourceVector ref="focusSourceRef" :format="geoJson" :features="geoJson.readFeatures(extremes)">
                    <Styles.OlStyle>
                        <!-- <Styles.OlStyleFill color="blue"></Styles.OlStyleFill> -->
                        <Styles.OlStyleStroke color="blue" :width="2"></Styles.OlStyleStroke>
                        <Styles.OlStyleCircle :radius="4">
                            <Styles.OlStyleFill color="blue"></Styles.OlStyleFill>
                            <Styles.OlStyleStroke color="blue" :width="1"></Styles.OlStyleStroke>
                        </Styles.OlStyleCircle>
                    </Styles.OlStyle>
                </Sources.OlSourceVector>
            </Layers.OlVectorLayer>
            <Layers.OlVectorLayer name="Triangles" :visible="false">
                <!-- @vue-ignore -->
                <Sources.OlSourceVector :format="geoJson" :features="geoJson.readFeatures(triangles)">
                    <Styles.OlStyle>
                        <Styles.OlStyleStroke color="#666" :width="1"></Styles.OlStyleStroke>
                    </Styles.OlStyle>
                </Sources.OlSourceVector>
            </Layers.OlVectorLayer>
            <Layers.OlVectorLayer name="Grid" :visible="false">
                <!-- @vue-ignore -->
                <Sources.OlSourceVector :format="geoJson" :features="geoJson.readFeatures(grid)">
                    <!-- <Styles.OlStyle>
                        <Styles.OlStyleFill color="rgba(255, 255, 255, 0.6)"></Styles.OlStyleFill>
                        <Styles.OlStyleStroke color="blue" :width="2"></Styles.OlStyleStroke>
                    </Styles.OlStyle> -->
                </Sources.OlSourceVector>
            </Layers.OlVectorLayer>
            <Layers.OlVectorLayer name="Contours">
                <!-- @vue-ignore -->
                <Sources.OlSourceVector :format="geoJson" :features="geoJson.readFeatures(contours)">
                    <Styles.OlStyle :overrideStyleFunction="styleFunction">
                        <Styles.OlStyleFill color="blue"></Styles.OlStyleFill>
                        <Styles.OlStyleStroke color="blue" :width="1/8"></Styles.OlStyleStroke>
                    </Styles.OlStyle>
                </Sources.OlSourceVector>
            </Layers.OlVectorLayer>
        </template>
    </BaseMap>
</template>
