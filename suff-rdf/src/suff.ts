import { Quad_Object } from "n3";
import { wktToGeoJSON } from "@terraformer/wkt";
import { RDFStore } from "./store";
import { Feat, FeatColl, Geom } from "./types";

export async function parse(data: string, format?: string): Promise<FeatColl> {
    const store = new RDFStore();
    await store.load(data, format);
    let lom = "";
    const feature = store.getSubject("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.opengis.net/ont/geosparql#Feature")!;
    const featureProps = {
        label: store.getLabel(feature.id)?.value,
    };
    const geometryCollection = store.getObject(feature.id, "http://www.opengis.net/ont/geosparql#hasGeometry")!;
    const members = store.getObjects(geometryCollection.id, "http://www.w3.org/2000/01/rdf-schema#member");
    const firstOrdered = store.getObjects(geometryCollection.id, "http://www.w3.org/2000/01/rdf-schema#_1");
    if (members.length > 0) {
        lom = "nominal";
    } else if (firstOrdered.length > 0) {
        let orderingPredicate = "http://www.w3.org/1999/02/22-rdf-syntax-ns#value";
        const orderPredicate = store.getObjects(geometryCollection.id, "http://w3id.org/suff/certaintyIndicator");
        if (orderPredicate.length > 0) {
            orderingPredicate = orderPredicate[0].value;
        }
        const certainty = store.getObjects(firstOrdered[0].id, orderingPredicate);
        if (certainty.length > 0) {
            if (Number(certainty[0].value) === 0) { // assume specify only 0 for now
                lom = "ratio";
            } else {
                lom = "interval";
            }
        } else {
            lom = "ordinal";
        }
    }

    let features: Feat[] = [];

    switch (lom) {
        case "nominal":
            features = nominal(geometryCollection, store, featureProps);
            break;
        case "ordinal":
            features = ordinal(geometryCollection, store, featureProps);
            break;
        case "interval":
            features = interval(geometryCollection, store, featureProps);
            break;
        case "ratio":
            features = ratio(geometryCollection, store, featureProps);
            break;
        default:
            console.log("Invalid level of measurement");
    }

    const geojson: FeatColl = {
        type: "FeatureCollection",
        features: features,
    };

    return geojson;
}

/**
 * For unordered geometries, all weighted equally
 * 
 * @param geometryCollection the `geo:GeometryCollection`
 * @param store the N3.js-based RDF store object
 * @returns the list of geometries
 */
function nominal(geometryCollection: Quad_Object, store: RDFStore, featureProps: {[key: string]: any}): Feat[] {
    const features: Feat[] = [];
    const geoms = store.getObjects(geometryCollection.id, "http://www.w3.org/2000/01/rdf-schema#member");

    if (geoms.length === 0) {
        return features;
    }

    const certainty = 1 / geoms.length;
    geoms.forEach(geom => {
        const g = store.getObject(geom.id, "http://www.opengis.net/ont/geosparql#asWKT")!.value;
        const citation = store.getObject(geom.id, "https://schema.org/citation")?.value;
        const geometry = wktToGeoJSON(g) as Geom;
        const feature = {
            type: "Feature",
            properties: {
                certainty: certainty,
                citation: citation,
                ...featureProps,
            },
            geometry: geometry,
        } as Feat;
        features.push(feature);
    });

    return features;
}
// @ts-ignore
function ordinal(geometryCollection: Quad_Object, store: RDFStore, featureProps: {[key: string]: any}): Feat[] {
    const features: Feat[] = [];
    return features;
}
// @ts-ignore
function interval(geometryCollection: Quad_Object, store: RDFStore, featureProps: {[key: string]: any}): Feat[] {
    const features: Feat[] = [];
    return features;
}

function ratio(geometryCollection: Quad_Object, store: RDFStore, featureProps: {[key: string]: any}): Feat[] {
    const features: Feat[] = [];

    let orderingPredicate = "http://www.w3.org/1999/02/22-rdf-syntax-ns#value";
    const orderPredicate = store.getObjects(geometryCollection.id, "http://w3id.org/suff/certaintyIndicator");
    if (orderPredicate.length > 0) {
        orderingPredicate = orderPredicate[0].value;
    }

    let index = 1;
    while (true) {
        const geom = store.getObject(geometryCollection.id, `http://www.w3.org/2000/01/rdf-schema#_${index}`);
        if (!geom) break;
        const certainty = store.getObject(geom.id, orderingPredicate)?.value;
        const g = store.getObject(geom.id, "http://www.opengis.net/ont/geosparql#asWKT")!.value;
        const citation = store.getObject(geom.id, "https://schema.org/citation")?.value;
        const geometry = wktToGeoJSON(g) as Geom;
        const feature = {
            type: "Feature",
            properties: {
                certainty: certainty,
                citation: citation,
                ...featureProps,
            },
            geometry: geometry,
        } as Feat;
        features.push(feature);
        index++;
    }

    return features;
}
