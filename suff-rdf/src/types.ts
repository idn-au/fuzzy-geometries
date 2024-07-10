export type Geom = {
    type: string;
    coordinates: number[];
    // attributes?: {[key: string]: any};
};

export type Feat = {
    type: "Feature";
    geometry: Geom;
    properties?: {[key: string]: any};
};

export type FeatColl = {
    type: "FeatureCollection";
    features: Feat[];
};
