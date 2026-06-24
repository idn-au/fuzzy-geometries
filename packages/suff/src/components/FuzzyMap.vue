<script lang="ts" setup>
import { computed, onMounted, nextTick, toRaw, useTemplateRef } from "vue";
// import { polygonToLine, explode, featureCollection, bbox, tin, pointGrid, tag, planepoint, isobands } from "@turf/turf";
import { OlVectorLayer } from "vue3-openlayers/layers";
import { OlSourceVector } from "vue3-openlayers/sources";
import {
	OlStyle,
	OlStyleStroke,
	// OlStyleCircle,
	OlStyleFill
} from "vue3-openlayers/styles";
import { GeoJSON } from "ol/format";
import type { FeatureLike } from "ol/Feature";
import type Style from "ol/style/Style";
import {
	generateContours,
	// generateGeomExtremes,
	// generateInterpolatedGrid,
	// generateTIN
} from "@/suff";
import Map from "@/components/Map.vue";

const geoJson = new GeoJSON();

const props = withDefaults(defineProps<{
	features?: any;
	gridSpacing?: number;
	contourCount?: number;
}>(), {
	gridSpacing: 2,
	contourCount: 50,
});

const baseMapRef = useTemplateRef("baseMapRef");
const contoursRef = useTemplateRef("contoursRef"); // the source to centre on

// const extremes = computed(() => generateGeomExtremes(toRaw(props.features)));
//
// const triangles = computed(() => generateTIN(extremes.value));
//
// const grid = computed(() => generateInterpolatedGrid(extremes.value, triangles.value, props.gridSpacing));

const contours = computed(() => props.features?.features?.length ? generateContours(toRaw(props.features), props.gridSpacing, props.contourCount) : undefined);

function styleFunction(feature: FeatureLike, style: Style) {
	style.getFill()?.setColor(`rgba(0, 0, 255, ${feature.get("certainty")})`);
	style.getStroke()?.setColor(`rgba(0, 0, 255, ${feature.get("certainty")**2})`);
	style.getStroke()?.setWidth(1/8);

	return style;
}

onMounted(() => {
	nextTick(() => {
		if (baseMapRef.value && contoursRef.value) {
			baseMapRef.value.fitToExtent(contoursRef.value.source.getExtent()!);
		}
	});
});
</script>

<template>
	<Map ref="baseMapRef" :animate="false">
		<template #layers>
<!--			<OlVectorLayer name="Features" :visible="false">-->
<!--				&lt;!&ndash; @vue-ignore &ndash;&gt;-->
<!--				<OlSourceVector :format="geoJson" :features="geoJson.readFeatures(props.features)">-->
<!--					<OlStyle :overrideStyleFunction="styleFunction">-->
<!--						<OlStyleFill color="blue"></OlStyleFill>-->
<!--						<OlStyleStroke color="blue" :width="2"></OlStyleStroke>-->
<!--					</OlStyle>-->
<!--				</OlSourceVector>-->
<!--			</OlVectorLayer>-->
<!--			<OlVectorLayer name="Extremes" :visible="false">-->
<!--				&lt;!&ndash; @vue-ignore &ndash;&gt;-->
<!--				<OlSourceVector ref="focusSourceRef" :format="geoJson" :features="geoJson.readFeatures(extremes)">-->
<!--					<OlStyle>-->
<!--						<OlStyleStroke color="blue" :width="2"></OlStyleStroke>-->
<!--						<OlStyleCircle :radius="4">-->
<!--							<OlStyleFill color="blue"></OlStyleFill>-->
<!--							<OlStyleStroke color="blue" :width="1"></OlStyleStroke>-->
<!--						</OlStyleCircle>-->
<!--					</OlStyle>-->
<!--				</OlSourceVector>-->
<!--			</OlVectorLayer>-->
<!--			<OlVectorLayer name="Triangles" :visible="false">-->
<!--				&lt;!&ndash; @vue-ignore &ndash;&gt;-->
<!--				<OlSourceVector :format="geoJson" :features="geoJson.readFeatures(triangles)">-->
<!--					<OlStyle>-->
<!--						<OlStyleStroke color="#666" :width="1"></OlStyleStroke>-->
<!--					</OlStyle>-->
<!--				</OlSourceVector>-->
<!--			</OlVectorLayer>-->
<!--			<OlVectorLayer name="Grid" :visible="false">-->
<!--				&lt;!&ndash; @vue-ignore &ndash;&gt;-->
<!--				<OlSourceVector :format="geoJson" :features="geoJson.readFeatures(grid)">-->
<!--				</OlSourceVector>-->
<!--			</OlVectorLayer>-->

			<slot name="layers" />

			<OlVectorLayer name="Contours">
				<OlSourceVector :format="geoJson" :features="contours ? geoJson.readFeatures(contours) : undefined" ref="contoursRef">
					<OlStyle :overrideStyleFunction="styleFunction">
						<OlStyleFill color="blue"></OlStyleFill>
						<OlStyleStroke color="blue" :width="1/8"></OlStyleStroke>
					</OlStyle>
				</OlSourceVector>
			</OlVectorLayer>
		</template>
	</Map>
</template>
