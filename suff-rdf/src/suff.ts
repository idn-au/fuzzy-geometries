import { Quad_Object } from "n3";
import { wktToGeoJSON } from "@terraformer/wkt";
import { polygonToLine, explode, featureCollection, buffer, pointToLineDistance, centroid } from "@turf/turf";
import type { FeatureCollection, Feature, Geometry, Polygon, MultiPolygon } from "geojson";
import { RDFStore } from "./store";
import type { ParseFormat } from "./types";

/**
 * Determines the level of measurement for the feature
 * 
 * Nominal: GeometryCollection contains `rdfs:member`  
 * Ordinal: GeometryCollection contains `rdfs:_N`  
 * Interval: GeometryCollection contains `rdfs:_N`, certainty values specified  
 * Ratio: GeometryCollection contains `rdfs:_N`, certainty 0 & 1 geometries specified
 * 
 * @param store 
 * @param geometryCollection 
 * @returns the level of measurement or undefined
 */
export function levelOfMeasurement(store: RDFStore, geometryCollection: Quad_Object): "nominal" | "ordinal" | "interval" | "ratio" | undefined {
    const members = store.getObjects(geometryCollection.id, "http://www.w3.org/2000/01/rdf-schema#member");
    const firstOrdered = store.getObject(geometryCollection.id, "http://www.w3.org/2000/01/rdf-schema#_1");
    if (members.length > 0) {
        return "nominal";
    } else if (firstOrdered) {
        let orderingPredicate = "http://www.w3.org/1999/02/22-rdf-syntax-ns#value";
        const orderPredicate = store.getObjects(geometryCollection.id, "http://w3id.org/suff/certaintyIndicator");
        if (orderPredicate.length > 0) {
            orderingPredicate = orderPredicate[0].value;
        }
        const certainty = store.getObjects(firstOrdered.id, orderingPredicate);
        if (certainty.length > 0) {
            if (Number(certainty[0].value) === 0) { // assume specify only 0 for now
                return "ratio";
            } else {
                return "interval";
            }
        } else {
            return "ordinal";
        }
    }

    return undefined;
}

/**
 * Converts SUFF RDF into a GeoJSON Feature Collection
 * 
 * @param data the data as a string
 * @param format the format of the data
 * @returns a Feature Collection object
 */
export async function convert(data: string, format?: ParseFormat): Promise<FeatureCollection> {
    const store = new RDFStore();
    await store.load(data, format);

    const feature = store.getSubject("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.opengis.net/ont/geosparql#Feature")!;
    const geometryCollection = store.getObject(feature.id, "http://www.opengis.net/ont/geosparql#hasGeometry")!;
    const featureProps = {
        label: store.getLabel(feature.id)?.value,
    };

    const lom = levelOfMeasurement(store, geometryCollection);
    if (!lom) throw new Error("Unable to detect level of measurement");

    switch (lom) {
        case "nominal":
            return nominal(geometryCollection, store, featureProps);
        case "ordinal":
            return ordinal(geometryCollection, store, featureProps);
        case "interval":
            return interval(geometryCollection, store, featureProps);
        case "ratio":
            return ratio(geometryCollection, store, featureProps);
    }
}

/**
 * For unordered geometries, all weighted equally
 * 
 * @param geometryCollection the `geo:GeometryCollection`
 * @param store the N3.js-based RDF store object
 * @param featureProps the `properties` object of the `geo:Feature`
 * @returns the GeoJSON Feature Collection
 */
export function nominal(geometryCollection: Quad_Object, store: RDFStore, featureProps: { [key: string]: any }): FeatureCollection {
    const geojson: FeatureCollection = {
        type: "FeatureCollection",
        features: [],
    };
    
    const geoms = store.getObjects(geometryCollection.id, "http://www.w3.org/2000/01/rdf-schema#member");

    if (geoms.length === 0) {
        return geojson;
    }

    const features: Feature[] = [];

    const certainty = 1 / geoms.length;
    geoms.forEach(geom => {
        const g = store.getObject(geom.id, "http://www.opengis.net/ont/geosparql#asWKT")!.value;
        const citation = store.getObject(geom.id, "https://schema.org/citation")?.value;
        const geometry = wktToGeoJSON(g) as Geometry;
        const feature = {
            type: "Feature",
            properties: {
                certainty: certainty,
                citation: citation,
                ...featureProps,
            },
            geometry: geometry,
        } as Feature;
        features.push(feature);
    });

    geojson.features = features;

    return geojson;
}

/**
 * For ordered geometries with no certainty values specified
 * 
 * Certainty is estimated for each geometry as equally spaced values increasing linearly with order.  
 * e.g. for 3 features - 0.25, 0.5, 0.75
 * 
 * @param geometryCollection the `geo:GeometryCollection`
 * @param store the N3.js-based RDF store object
 * @param featureProps the `properties` object of the `geo:Feature`
 * @returns the GeoJSON Feature Collection
 */
export function ordinal(geometryCollection: Quad_Object, store: RDFStore, featureProps: { [key: string]: any }): FeatureCollection {
    const features: Feature[] = [];

    // calculate ordered list length
    // iterate through rdfs:_N
    let length = 1;
    while (true) {
        const geom = store.getObject(geometryCollection.id, `http://www.w3.org/2000/01/rdf-schema#_${length}`);
        if (!geom) break;
        length++;
    }
    const listLength = length - 1;

    for (let i = 1; i < listLength + 1; i++) {
        const geom = store.getObject(geometryCollection.id, `http://www.w3.org/2000/01/rdf-schema#_${i}`)!;
        const certainty = i * 1 / (listLength + 1);
        const g = store.getObject(geom.id, "http://www.opengis.net/ont/geosparql#asWKT")!.value;
        const citation = store.getObject(geom.id, "https://schema.org/citation")?.value;
        const geometry = wktToGeoJSON(g) as Geometry;
        const feature = {
            type: "Feature",
            properties: {
                certainty: certainty,
                citation: citation,
                ...featureProps,
            },
            geometry: geometry,
        } as Feature;
        features.push(feature);
    }

    const geojson: FeatureCollection = {
        type: "FeatureCollection",
        features: features,
    };

    return generateGeomExtremes(geojson);
}

/**
 * For ordered geometries with certainty values specified
 * 
 * @param geometryCollection the `geo:GeometryCollection`
 * @param store the N3.js-based RDF store object
 * @param featureProps the `properties` object of the `geo:Feature`
 * @returns the GeoJSON Feature Collection
 */
export function interval(geometryCollection: Quad_Object, store: RDFStore, featureProps: { [key: string]: any }): FeatureCollection {
    const features: Feature[] = [];

    let orderingPredicate = "http://www.w3.org/1999/02/22-rdf-syntax-ns#value";
    const orderPredicate = store.getObjects(geometryCollection.id, "http://w3id.org/suff/certaintyIndicator");
    if (orderPredicate.length > 0) {
        orderingPredicate = orderPredicate[0].value;
    }

    // iterate through rdfs:_N
    let index = 1;
    while (true) {
        const geom = store.getObject(geometryCollection.id, `http://www.w3.org/2000/01/rdf-schema#_${index}`);
        if (!geom) break;
        const certainty = store.getObject(geom.id, orderingPredicate)?.value;
        const g = store.getObject(geom.id, "http://www.opengis.net/ont/geosparql#asWKT")!.value;
        const citation = store.getObject(geom.id, "https://schema.org/citation")?.value;
        const geometry = wktToGeoJSON(g) as Geometry;
        const feature = {
            type: "Feature",
            properties: {
                certainty: certainty,
                citation: citation,
                ...featureProps,
            },
            geometry: geometry,
        } as Feature;
        features.push(feature);
        index++;
    }

    const geojson: FeatureCollection = {
        type: "FeatureCollection",
        features: features,
    };

    return generateGeomExtremes(geojson);
}

/**
 * For ordered geometries with 0 & 1 certainty geometries specified
 * 
 * @param geometryCollection the `geo:GeometryCollection`
 * @param store the N3.js-based RDF store object
 * @param featureProps the `properties` object of the `geo:Feature`
 * @returns the GeoJSON Feature Collection
 */
export function ratio(geometryCollection: Quad_Object, store: RDFStore, featureProps: { [key: string]: any }): FeatureCollection {
    const features: Feature[] = [];

    let orderingPredicate = "http://www.w3.org/1999/02/22-rdf-syntax-ns#value";
    const orderPredicate = store.getObjects(geometryCollection.id, "http://w3id.org/suff/certaintyIndicator");
    if (orderPredicate.length > 0) {
        orderingPredicate = orderPredicate[0].value;
    }

    // iterate through rdfs:_N
    let index = 1;
    while (true) {
        const geom = store.getObject(geometryCollection.id, `http://www.w3.org/2000/01/rdf-schema#_${index}`);
        if (!geom) break;
        const certainty = store.getObject(geom.id, orderingPredicate)?.value;
        const g = store.getObject(geom.id, "http://www.opengis.net/ont/geosparql#asWKT")!.value;
        const citation = store.getObject(geom.id, "https://schema.org/citation")?.value;
        const geometry = wktToGeoJSON(g) as Geometry;
        const feature = {
            type: "Feature",
            properties: {
                certainty: certainty,
                citation: citation,
                ...featureProps,
            },
            geometry: geometry,
        } as Feature;
        features.push(feature);
        index++;
    }

    const geojson: FeatureCollection = {
        type: "FeatureCollection",
        features: features,
    };

    return geojson;
}

export function generateGeomExtremes(fObj: FeatureCollection) {
    fObj.features.sort((a, b) => a.properties!.certainty - b.properties!.certainty);

    const featureColl = featureCollection([]);

    if (fObj.features.length > 1) {
        featureColl.features = structuredClone(fObj.features);

        // buffer proportional to different in certainty

        // generate 0 certainty polygon - might need to be a buffer of the outline/union of all features?
        // union -> convex
        const lineFirst = polygonToLine(fObj.features[0] as Feature<Polygon | MultiPolygon>, {
            properties: {
                certainty: fObj.features[0].properties!["certainty"]
            }
        });

        const lineSecond = polygonToLine(fObj.features[1] as Feature<Polygon | MultiPolygon>, {
            properties: {
                certainty: fObj.features[1].properties!["certainty"]
            }
        });

        // @ts-ignore
        const zeroDistances = explode(lineSecond).features.map(f => pointToLineDistance(f, lineFirst));
        const zeroMeanDistance = zeroDistances.reduce((prev, curr) => prev + curr, 0) / zeroDistances.length;
        
        const polygonZero = buffer(fObj.features[0], zeroMeanDistance)!;
        polygonZero.properties = {
            certainty: 0
        };

        featureColl.features.unshift(polygonZero); // add to start

        // generate 1 certainty polygon
        const lineSecondLast = polygonToLine(fObj.features[fObj.features.length - 2] as Feature<Polygon | MultiPolygon>, {
            properties: {
                certainty: fObj.features[fObj.features.length - 2].properties!["certainty"]
            }
        });

        const lineLast = polygonToLine(fObj.features[fObj.features.length - 1] as Feature<Polygon | MultiPolygon>, {
            properties: {
                certainty: fObj.features[fObj.features.length - 1].properties!["certainty"]
            }
        });

        // @ts-ignore
        // intersect -> convex?
        const oneDistances = explode(lineLast).features.map(f => pointToLineDistance(f, lineSecondLast));
        const oneMeanDistance = oneDistances.reduce((prev, curr) => prev + curr, 0) / oneDistances.length;
        
        const negBuff = buffer(fObj.features[fObj.features.length - 1], -oneMeanDistance);
        const polygonOne = negBuff ? negBuff : centroid(fObj.features[fObj.features.length - 1]);
        polygonOne.properties = {
            certainty: 1
        }
        featureColl.features.push(polygonOne);
    }

    return featureColl;
}

// export function generateTIN(features) {
//     const featureColl = featureCollection([]);

//     features.value.features.forEach(f => {
//         if (f.geometry.type === "Point") { // could be a point centroid
//             featureColl.features.push(f);
//         } else {
//             const line = polygonToLine(f, {
//                 properties: {
//                     certainty: f.properties["certainty"]
//                 }
//             });
            
//             const exp = explode(line);
//             featureColl.features.push(...exp.features);
//         }
//     });

//     const tinTriangles = tin(featureColl, "certainty");
//     tinTriangles.features.forEach((f, index) => {
//         f.properties.index = index;
//     });

//     return tinTriangles;
// }

// export function generateInterpolatedGrid() {
    
// }

// export function generateContours() {
    
// }