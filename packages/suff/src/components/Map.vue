<script setup lang="ts">
import {type HTMLAttributes, useTemplateRef, ref, computed, watch, provide, onMounted, nextTick} from "vue";
import { Eraser, Pentagon, LoaderCircle, View, ChevronDown, MapPin, type LucideIcon, RectangleHorizontal, Waypoints, Pencil, SquaresIntersect} from "@lucide/vue";
import { OlMap, OlView, OlOverlay } from "vue3-openlayers/map";
import { OlTileLayer, OlVectorLayer } from "vue3-openlayers/layers";
import { OlSourceOSM, OlSourceVector } from "vue3-openlayers/sources";
import { OlFullScreenControl, OlZoomSliderControl, OlScaleLineControl, OlLayerSwitcherControl } from "vue3-openlayers/controls";
import { OlStyle, OlStyleStroke, OlStyleCircle, OlStyleFill } from "vue3-openlayers/styles";
import { OlInteractionSelect, OlInteractionDraw, OlInteractionMouseWheelZoom, OlInteractionModify } from "vue3-openlayers/interactions";
import {createBox, type GeometryFunction, type Mode} from "ol/interaction/Draw";
import { type Vue3OpenlayersGlobalOptions } from "vue3-openlayers";
import { GeoJSON, WKT } from "ol/format";
import { bbox } from "ol/loadingstrategy";
import { click } from "ol/events/condition";
import {createEmpty, extend, getCenter} from "ol/extent";
import { SelectEvent } from "ol/interaction/Select";
// import Style from "ol/style/Style";
import { getArea } from "ol/sphere";
import type { Extent } from "ol/extent";
import type { ProjectionLike } from "ol/proj";
import type { DrawEvent } from "ol/interaction/Draw";
import type Geometry from "ol/geom/Geometry";
import Feature from "ol/Feature";
// import type { FeatureLike } from "ol/Feature";
import {ModifyEvent} from "ol/interaction/Modify";
// import type {FeatureCollection, Feature as GeoJSONFeature} from "geojson";
import { platformModifierKeyOnly } from "ol/events/condition";
import "ol/ol.css";
import "ol-ext/control/LayerSwitcher.css";
import "vue3-openlayers/vue3-openlayers.css";
import {ButtonGroup} from "@/components/ui/button-group";
import BaseMapTooltip from "./BaseMapTooltip.vue";
import MapButton from "./MapButton.vue";
// import {Button} from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuLabel, DropdownMenuRadioGroup, DropdownMenuRadioItem,
	DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";

type MapFeature = {
	type?: string;
	geometry: string | any;
	id?: string | number;
	properties?: { [x: string]: any };
};

type MapData = {
	title?: string;
	type?: string;
	features: MapFeature[];
};

const props = withDefaults(defineProps<{
	/**
	 * Data to load on the map.
	 *
	 * Can be a single object or an array. Each feature within a layer can be either WKT or GeoJSON format
	 */
	data?: MapData | MapData[];
	/**
	 * Displays the toolbar
	 */
	showToolbar?: boolean;
	/**
	 * Enables drawing tools
	 */
	enableDrawing?: boolean;
	/**
	 * The map's default centre coordinates
	 * @default [133.7751, -25.2744] (Australia)
	 */
	center?: [number, number];
	/**
	 * The map's default zoom value
	 * @default 4
	 */
	zoom?: number;
	/**
	 * The map's default rotation value
	 * @default 0
	 */
	rotation?: number;
	/**
	 * The map's default projection
	 * @default "EPSG:4326" (WGS84)
	 */
	projection?: ProjectionLike;
	/**
	 * Enables scrolling with the scroll wheel without the modifier key (`cmd`/`ctrl`)
	 */
	zoomScrollWheel?: boolean;
	/**
	 * Available drawing tools
	 */
	drawTypes?: DrawType[];
	/**
	 * The default drawing tool
	 */
	defaultDrawType?: DrawType;
	/**
	 * The format of drawn features
	 * @default "GeoJSON"
	 */
	drawFormat?: "GeoJSON" | "WKT";
	/**
	 * Whether the map should fit to the extent of recently loaded feature data
	 */
	fitToData?: boolean;
	/**
	 * Whether map focusing should animate on zoom
	 * @default true
	 */
	animate?: boolean;
	class?: HTMLAttributes["class"];
}>(), {
	center: () => [133.7751, -25.2744],
	zoom: 4,
	rotation: 0,
	projection: "EPSG:4326",
	drawFormat: "GeoJSON",
	animate: true,
});

const animationDuration = 500; // ms

const modifierKeySymbol = navigator.platform.startsWith("Mac") ? "⌘" : "ctrl";

type DrawType = Exclude<Mode, "Circle"> | "Box";

const drawTypeMap: Record<DrawType, {type: Mode; icon: LucideIcon; geometryFunction?: GeometryFunction}> = {
	"Box": {type: "Circle", icon: RectangleHorizontal, geometryFunction: createBox()},
	// "Circle": {type: "Circle", icon: Circle},
	"LineString": {type: "LineString", icon: Waypoints},
	"Point": {type: "Point", icon: MapPin},
	"Polygon": {type: "Polygon", icon: Pentagon},
};

const wktFormat = new WKT();
const geoJSONFormat = new GeoJSON();

provide("ol-options", { debug: false } as Vue3OpenlayersGlobalOptions);

// const mapRef = useTemplateRef("mapRef");
const viewRef = useTemplateRef("viewRef");
const drawSourceRef = useTemplateRef("drawSourceRef");
const clickSelectRef = useTemplateRef("clickSelectRef");
const dataSourceRef = useTemplateRef("dataSourceRef");

const emit = defineEmits<{
	drawStart: [];
	/**
	 * When a feature is drawn. Returns a GeoJSON Feature
	 */
	drawEnd: [feature: MapFeature];
	editStart: [];
	/**
	 * When a feature is edited. Returns a GeoJSON Feature
	 */
	editEnd: [feature: MapFeature];
	/**
	 * When all drawings are cleared from the map
	 */
	clearDrawing: [];
	/**
	 * When features are selected
	 */
	select: [features: Feature<Geometry>[]];
}>();

/**
 * The map's loading state
 * @default false
 */
const loading = defineModel<boolean>("loading", {default: false});
/**
 * A GeoJSON FeatureCollection of the drawn features on the map
 * @default {type: "FeatureCollection", features: []}
 */
const drawnFeatures = defineModel<MapData>("drawn", {default: {type: "FeatureCollection", features: []}});

const drawType = ref<DrawType>(props.defaultDrawType || (props.drawTypes && props.drawTypes.length > 0 && !props.drawTypes.includes("Polygon") ? props.drawTypes[0] : "Polygon"));
const drawModeEnabled = ref(false);
const editModeEnabled = ref(false);
// OpenLayers format for the drawing layer used by the `VectorSource` component
const convertedDrawnFeatures = ref();
const selectedFeatures = ref<Feature<Geometry>[]>([]);
const clickThroughEnabled = ref(false);

// OpenLayers format for the data props used by the `VectorSource` components
const convertedMapData = computed<{title?: string; features: Feature<Geometry>[]}[]>(() => {
	if (props.data === undefined || (Array.isArray(props.data) && props.data.length === 0)) return [];
	const layers = (Array.isArray(props.data) ? props.data : [props.data]).map(l => {
		const features = l.features.map(f => {
			const feature = new Feature({
				geometry: typeof f.geometry === "string" ? (wktFormat.readGeometry(f.geometry)) : geoJSONFormat.readGeometry(f.geometry),
			});

			if (f.properties) {
				feature.setProperties({properties: f.properties});
			}

			return feature;
		});

		// sort by descending area - better for clicking overlapping features
		features.sort((a, b) => getArea(b.getGeometry()!) - getArea(a.getGeometry()!));

		// TODO - set IDs?

		return {
			title: l.title,
			features
		};
	});

	// TODO - set layer properties - name, etc.
	// TODO - set default layer colours - iterate

	return layers;
});

/**
 * Resets the map's current view to the default zoom & centre
 */
function resetExtent() {
	if (viewRef.value) {
		viewRef.value.setCenter(props.center);
		viewRef.value.setZoom(props.zoom);
	}
}

/**
 * Toggles drawing mode, disabling edit mode if active
 */
function toggleDraw() {
	drawModeEnabled.value = !drawModeEnabled.value;
	if (editModeEnabled.value) {
		editModeEnabled.value = false;
	}
}

/**
 * Toggles edit mode, disabling drawing mode if active
 */
function toggleEdit() {
	editModeEnabled.value = !editModeEnabled.value;
	if (drawModeEnabled.value) {
		drawModeEnabled.value = false;
	}
}

/**
 * Handles the `drawend` event from drawing a feature and emits the feature
 * @param e The DrawEvent containing the drawn feature in GeoJSON
 */
function handleDraw(e: DrawEvent) {
	const drawnFeature = e.feature;
	drawnFeature.setId(drawnFeatures.value.features.length);
	const wktObj: MapFeature = {
		type: props.drawFormat === "WKT" ? undefined : "Feature",
		geometry: props.drawFormat === "WKT"
			? wktFormat.writeGeometry(drawnFeature.getGeometry()!, {dataProjection: props.projection})
			: geoJSONFormat.writeGeometryObject(drawnFeature.getGeometry()!, {dataProjection: props.projection}),
		id: drawnFeature.getId(),
		properties: drawnFeature.getProperties().properties,
	};
	drawnFeatures.value.features.push(wktObj);
	emit("drawEnd", wktObj);
	drawModeEnabled.value = false;
}

/**
 * Handles the `modifyend` event from editing features and emits the modified features
 * @param e The ModifyEvent containing the edited features
 */
function handleEdit(e: ModifyEvent) {
	const modifiedFeature = e.features.item(0);
	const index = drawnFeatures.value.features.findIndex(f => f.id === modifiedFeature.getId());
	if (props.drawFormat === "WKT") {
		const {geometry, ...properties} = modifiedFeature.getProperties()
		const wktObj: MapFeature = {
			geometry: wktFormat.writeFeature(modifiedFeature, {
				dataProjection: props.projection,
			}),
			id: modifiedFeature.getId(),
			properties: properties,
		};
		if (index !== -1) {
			drawnFeatures.value.features[index] = wktObj;
		}
		emit("editEnd", wktObj);
	} else {
		const modifiedFeatureGeoJson = geoJSONFormat.writeFeatureObject(modifiedFeature, {
			dataProjection: props.projection,
		}) as MapFeature;
		if (index !== -1) {
			drawnFeatures.value.features[index] = modifiedFeatureGeoJson;
		}
		emit("editEnd", modifiedFeatureGeoJson);
	}
}

/**
 * Clears all drawn features from the map
 */
function clearDrawings() {
	drawSourceRef.value?.source.clear();
	drawnFeatures.value.features = [];
	emit("clearDrawing");
}

function handleSelect(e: SelectEvent) {
	if (e.selected.length > 0) {
		selectedFeatures.value = e.selected;
	} else {
		selectedFeatures.value = [];
	}
}

/**
 * Converts a feature layer into OpenLayer's Feature format
 * @param data feature layer to convert
 * @returns An array of OpenLayers Feature objects
 */
function convertToOl(data: MapData): Feature<Geometry>[] {
	return data.features.map((f, i) => {
		const feature = new Feature({
			geometry: typeof f.geometry === "string"
				? (wktFormat.readGeometry(f.geometry))
				: geoJSONFormat.readGeometry(f.geometry),
		});

		feature.setId(i);

		if (f.properties) {
			feature.setProperties({properties: f.properties});
		}

		return feature;
	});
}

/**
 * Converts OpenLayers Feature layer to the source data format
 * @param features OpenLayers Feature layer
 * @param format the format to convert to
 * @returns the converted feature layer
 */
function convertToData(features: Feature<Geometry>[], format: typeof props.drawFormat): MapData {
	return {
		type: "FeatureCollection",
		features: features.map((f, i) => {
			return {
				type: format === "WKT" ? undefined : "Feature",
				geometry: format === "WKT"
					? wktFormat.writeGeometry(f.getGeometry()!, {dataProjection: props.projection})
					: geoJSONFormat.writeGeometryObject(f.getGeometry()!, {dataProjection: props.projection}),
				id: i,
				properties: f.getProperties().properties,
			};
		})
	} as MapData;
}

/**
 * De-selects a selected feature, or all features if `index` is undefined
 * @param index the index of the feature
 */
function deselect(index?: number) {
	if (clickSelectRef.value) {
		if (index !== undefined) {
			// TODO - remove feature index from select interaction component
			selectedFeatures.value.splice(index, 1);
		} else {
			clickSelectRef.value.select.getFeatures().clear();
			selectedFeatures.value = [];
		}
	}
}

/**
 * Fits the map to an extent of coordinates
 * @param extent the extent to fit the map to
 */
function fitToExtent(extent: Extent) {
	if (viewRef.value && extent && extent[0] !== Infinity) {
		viewRef.value.view.fit(extent, {
			maxZoom: 20,
			padding: [32, 32, 32, 32],
			duration: props.animate ? animationDuration : 0,
		});
	}
}

/**
 * Fits the map to the total extent of all data layers
 */
function fitToDataExtent() {
	if (dataSourceRef.value) {
		let extent = createEmpty();
		dataSourceRef.value.forEach(l => extend(extent, l!.source.getExtent()!));
		fitToExtent(extent);
	}
}

defineExpose({
	viewRef,
	fitToExtent,
});

watch(drawnFeatures, (newValue) => {
	convertedDrawnFeatures.value = convertToOl(newValue);
});

watch(() => props.data, () => {
	nextTick(() => {
		fitToDataExtent();
	});
});

watch(() => props.drawFormat, (newValue, oldValue) => {
	if (newValue !== oldValue && drawSourceRef.value) {
		drawnFeatures.value = convertToData(drawSourceRef.value.source.getFeatures(), newValue);
	}
});

onMounted(() => {
	convertedDrawnFeatures.value = convertToOl(drawnFeatures.value);
	if (props.fitToData) {
		fitToDataExtent();
	}
});
</script>

<template>
	<div :class="cn('h-[500px] flex flex-col', props.class)">
		<OlMap
			ref="mapRef"
			:loadTilesWhileAnimating="true"
			:loadTilesWhileInteracting="true"
			class="h-full w-full relative rounded-lg overflow-hidden"
		>
			<OlView
				ref="viewRef"
				:projection="props.projection"
				:center="props.center"
				:rotation="props.rotation"
				:zoom="props.zoom"
			/>

			<slot name="tiles">
				<OlTileLayer title="OpenStreetMap" :displayInLayerSwitcher="false">
					<OlSourceOSM />
				</OlTileLayer>
			</slot>

			<!-- draw layer -->
			<OlVectorLayer v-if="props.enableDrawing" title="Drawing">
				<OlSourceVector
					ref="drawSourceRef"
					:features="convertedDrawnFeatures"
					:projection="props.projection"
					:strategy="bbox"
				>
					<OlInteractionDraw
						v-if="drawModeEnabled"
						:type="drawTypeMap[drawType].type"
						:geometryFunction="drawTypeMap[drawType].geometryFunction"
						@drawstart="emit('drawStart')"
						@drawend="handleDraw"
					>
						<OlStyle>
							<OlStyleStroke color="blue" :width="2"></OlStyleStroke>
							<OlStyleFill color="rgba(255, 255, 0, 0.4)"></OlStyleFill>
							<OlStyleCircle :radius="5">
								<OlStyleFill color="#00dd11" />
								<OlStyleStroke color="blue" :width="2" />
							</OlStyleCircle>
						</OlStyle>
					</OlInteractionDraw>
					<OlInteractionModify
						v-if="editModeEnabled"
						:source="drawSourceRef?.source"
						@modifystart="emit('editStart')"
						@modifyend="handleEdit"
					>
						<OlStyle>
							<OlStyleStroke color="blue" :width="2"></OlStyleStroke>
							<OlStyleCircle :radius="6">
								<OlStyleFill color="lightblue"></OlStyleFill>
								<OlStyleStroke :width="1" color="white"></OlStyleStroke>
							</OlStyleCircle>
						</OlStyle>
					</OlInteractionModify>
				</OlSourceVector>
			</OlVectorLayer>

			<!-- data layers -->
			<OlVectorLayer v-for="(layer, index) in convertedMapData" :title="layer.title || `Data layer ${index}`">
				<OlSourceVector :features="layer.features" :strategy="bbox" ref="dataSourceRef">

				</OlSourceVector>
			</OlVectorLayer>

			<slot name="layers" />

			<OlInteractionMouseWheelZoom v-if="!props.zoomScrollWheel" :condition="platformModifierKeyOnly" />

			<!-- multi-select doesn't work properly if reactively changing the multi prop -->
			<template v-if="!drawModeEnabled">
				<OlInteractionSelect v-if="clickThroughEnabled" :condition="click" @select="handleSelect" ref="clickSelectRef" multi>
					<OlStyle>
						<OlStyleStroke color="blue" :width="2"></OlStyleStroke>
						<OlStyleFill color="rgba(0, 190, 110, 0.4)"></OlStyleFill>
						<OlStyleCircle :radius="5">
							<OlStyleFill color="#00dd11" />
							<OlStyleStroke color="blue" :width="2" />
						</OlStyleCircle>
					</OlStyle>
				</OlInteractionSelect>
				<OlInteractionSelect v-else :condition="click" @select="handleSelect" ref="clickSelectRef">
					<OlStyle>
						<OlStyleStroke color="blue" :width="2"></OlStyleStroke>
						<OlStyleFill color="rgba(0, 190, 110, 0.4)"></OlStyleFill>
						<OlStyleCircle :radius="5">
							<OlStyleFill color="#00dd11" />
							<OlStyleStroke color="blue" :width="2" />
						</OlStyleCircle>
					</OlStyle>
				</OlInteractionSelect>
			</template>

			<slot name="interactions" />

			<OlLayerSwitcherControl />
			<OlFullScreenControl />
			<OlScaleLineControl />
			<OlZoomSliderControl />
			<MapButton size="icon" class="left-2 bottom-17" tooltip="Reset map view" tooltipSide="right" @click="resetExtent">
				<View class="size-4.5" />
			</MapButton>

			<div v-if="props.showToolbar" class="z-[1] flex flex-row gap-2 absolute left-1/2 -translate-x-1/2 top-2">
				<ButtonGroup v-if="props.enableDrawing">
					<MapButton
						:active="drawModeEnabled"
						class="relative"
						size="icon"
						tooltip="Toggle drawing"
						tooltipSide="bottom"
						@click="toggleDraw"
					>
						<component :is="drawTypeMap[drawType].icon" />
					</MapButton>
					<DropdownMenu v-if="!props.drawTypes || props.drawTypes.length > 1">
						<DropdownMenuTrigger asChild>
							<MapButton
								size="icon"
								class="relative"
								tooltip="Select draw shape"
								tooltipSide="bottom"
							>
								<ChevronDown />
							</MapButton>
						</DropdownMenuTrigger>
						<DropdownMenuContent align="end" class="[--radius:1rem]">
							<DropdownMenuLabel class="text-muted-foreground">Shape</DropdownMenuLabel>
							<DropdownMenuGroup>
								<DropdownMenuRadioGroup v-model="drawType">
									<template v-for="(typeObj, type) in drawTypeMap">
										<DropdownMenuRadioItem v-if="!props.drawTypes || props.drawTypes.includes(type)" :value="type">
											<component :is="typeObj.icon" /> {{type}}
										</DropdownMenuRadioItem>
									</template>
								</DropdownMenuRadioGroup>
							</DropdownMenuGroup>
						</DropdownMenuContent>
					</DropdownMenu>
					<MapButton
						:active="editModeEnabled"
						size="icon"
						class="relative"
						tooltip="Edit drawing"
						tooltipSide="bottom"
						@click="toggleEdit"
					>
						<Pencil class="size-4" />
					</MapButton>
					<MapButton
						size="icon"
						class="relative"
						tooltip="Clear all drawn features from the map"
						tooltipSide="bottom"
						@click="clearDrawings"
					>
						<Eraser class="size-4" />
					</MapButton>
				</ButtonGroup>
				<MapButton
					:active="clickThroughEnabled"
					size="icon"
					class="relative"
					tooltip="Toggle selecting overlapping features"
					tooltipSide="bottom"
					@click="clickThroughEnabled = !clickThroughEnabled"
				>
					<SquaresIntersect class="size-4" />
				</MapButton>
				<slot name="toolbar" />
<!--				<MapButton-->
<!--					size="icon"-->
<!--					variant="outline"-->
<!--					:active="clickThroughModeEnabled"-->
<!--					class="relative"-->
<!--					:tooltip="clickThroughModeEnabled ? 'Disable to only select top feature on click' : 'Enable to select all overlapping features on click'"-->
<!--					tooltipSide="bottom"-->
<!--					@click="clickThroughModeEnabled = !clickThroughModeEnabled"-->
<!--				>-->
<!--					<ChevronsDown class="size-4" />-->
<!--				</MapButton>-->
<!--				<template v-if="enableClearFeatures">-->
<!--					<MapButton-->
<!--						size="icon"-->
<!--						variant="outline"-->
<!--						class="relative"-->
<!--						tooltip="Clear all features from the map"-->
<!--						tooltipSide="bottom"-->
<!--						@click="clearAll"-->
<!--					>-->
<!--						<Trash class="size-4" />-->
<!--					</MapButton>-->
<!--				</template>-->
			</div>

			<slot name="controls" />

			<!-- TODO - get position of select click rather than centroid -->
			<OlOverlay
				v-for="(feature, index) in selectedFeatures"
				:position="getCenter(feature.getGeometry()!.getExtent())"
				positioning="bottom-center"
				stopEvent
			>
				<BaseMapTooltip
					:feature="feature as Feature<Geometry>"
					@deselect="deselect(index)"
					@deselectAll="deselect"
					@focus="fitToExtent(feature.getGeometry()!.getExtent())"
				/>
			</OlOverlay>

			<slot name="overlays" />

			<div v-if="loading" class="bg-background rounded-md p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 flex flex-row items-center gap-2">
				<LoaderCircle class="size-4 animate-spin" />
				<span>Loading...</span>
			</div>
		</OlMap>
		<span v-if="!props.zoomScrollWheel" class="text-xs text-muted-foreground px-2">{{ modifierKeySymbol }} + scroll wheel to zoom</span>
	</div>
</template>

<style scoped>
:deep(.ol-control) {
	background-color: transparent;
}

:deep(.ol-control) button {
	background-color: var(--color-background);
	border: 1px solid var(--color-border);
	border-radius: calc(var(--radius) - 2px);
	color: var(--color-foreground);
	outline: none;
	cursor: pointer;
	transition-property: color, background-color;
	transition-timing-function: var(--tw-ease, var(--default-transition-timing-function));
	transition-duration: var(--tw-duration, var(--default-transition-duration));
}

:deep(.ol-control) button:not(.ol-zoomslider-thumb) {
	width: calc(var(--spacing) * 9);
	height: calc(var(--spacing) * 9);
	margin: 0;
}

:deep(.ol-control:not(.ol-layerswitcher)) button {
	font-size: 22px;
	font-weight: normal;
}

:deep(.ol-control) button:hover {
	outline: none;
	background-color: var(--color-accent);
}

:deep(.ol-zoom) button.ol-zoom-in {
	border-bottom-left-radius: 0;
	border-bottom-right-radius: 0;
	margin-bottom: 0;
	border-bottom: none;
}

:deep(.ol-zoom) button.ol-zoom-out {
	border-top-left-radius: 0;
	border-top-right-radius: 0;
	margin-top: 0;
}

:deep(.ol-layerswitcher) {
	top: 3.2em;
}

:deep(.ol-layerswitcher) button::before, :deep(.ol-layerswitcher) button::after {
	--size: 18px;
	height: var(--size);
	width: var(--size);
	left: 8px;
}

:deep(.ol-layerswitcher) button::before {
	top: .32em;
}

:deep(.ol-layerswitcher) button::after {
	top: .22em;
}

:deep(.ol-layerswitcher) > .panel-container {
	background-color: var(--background);
	border-radius: calc(var(--radius) - 2px);
	padding: 0.5em;
}

:deep(.ol-bar.ol-control.ol-group) button {
	border-radius: 0;
	margin: 0;
	border-right: none;
}

:deep(.ol-bar.ol-control.ol-group) > div:first-child > button {
	border-top-left-radius: calc(var(--radius) - 2px);
	border-bottom-left-radius: calc(var(--radius) - 2px);
}

:deep(.ol-bar.ol-control.ol-group) > div:last-child > button {
	border-top-right-radius: calc(var(--radius) - 2px);
	border-bottom-right-radius: calc(var(--radius) - 2px);
	border-right: 1px solid var(--color-border);
}

:deep(.ol-bar.ol-control.ol-group) > div.ol-active > button {
	background-color: var(--color-secondary);
	color: var(--color-secondary-foreground);
	border-color: var(--color-secondary);
}
</style>
