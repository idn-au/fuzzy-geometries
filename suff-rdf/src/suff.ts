import { Quad_Object } from "n3";
import { wktToGeoJSON } from "@terraformer/wkt";
import { RDFStore } from "./store";

export async function parse(data: string, format?: string) {
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

    let geometries = [];

    switch (lom) {
        case "nominal":
            geometries = nominal(geometryCollection, store);
            break;
        case "ordinal":
            geometries = ordinal(geometryCollection, store);
            break;
        case "interval":
            geometries = interval(geometryCollection, store);
            break;
        case "ratio":
            geometries = ratio(geometryCollection, store);
            break;
        default:
            console.log("Invalid level of measurement");
    }

    const geojson = {
        "type": "Feature",
        "properties": featureProps,
        "geometries": geometries
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
function nominal(geometryCollection: Quad_Object, store: RDFStore): any[] {
    const geometries = [];
    const geoms = store.getObjects(geometryCollection.id, "http://www.w3.org/2000/01/rdf-schema#member");

    if (geoms.length === 0) {
        return geometries;
    }

    const certainty = 1 / geoms.length;
    geoms.forEach(geom => {
        const g = store.getObject(geom.id, "http://www.opengis.net/ont/geosparql#asWKT")!.value;
        const citation = store.getObject(geom.id, "https://schema.org/citation")?.value;
        const coords = wktToGeoJSON(g);
        coords["attributes"] = {
            certainty: certainty,
            citation: citation,
        };
        geometries.push(coords);
    });

    return geometries;
}

function ordinal(geometryCollection: Quad_Object, store: RDFStore) {

}

function interval(geometryCollection: Quad_Object, store: RDFStore) {

}

function ratio(geometryCollection: Quad_Object, store: RDFStore) {

}
