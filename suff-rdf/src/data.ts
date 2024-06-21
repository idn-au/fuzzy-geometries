export const TEST_TURTLE_DATA_NOMINAL = `
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sdo: <https://schema.org/>
PREFIX suff: <http://w3id.org/suff/>

<https://example.com/feature/feature1>
    a geo:Feature ;
    sdo:name "Test nominal feature" ;
    geo:hasGeometry [
        a geo:GeometryCollection ;
        rdfs:member [
            a geo:Geometry ;
            sdo:citation "desc 1" ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        ] ,
        [
            a geo:Geometry ;
            # sdo:citation "desc 2" ;
            geo:asWKT "POLYGON (( 153.07622993690768 -27.474970544592097, 153.07718581203278 -27.619747164859454, 153.14660982624144 -27.544675165467154, 153.18130890101986 -27.573628599357917, 153.1977202487455 -27.408834186051493, 153.16810952965136 -27.451419939677578, 153.07622993690768 -27.474970544592097 ))"^^geo:wktLiteral ;
        ] ;
    ] ;
.
`;

export const TEST_TURTLE_DATA_ORDINAL = `
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX suff: <http://w3id.org/suff/>

<geom>
    a geo:GeometryCollection ;
    rdfs:_1 [
        a geo:Geometry ;
        geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
    ] ;
.
`;

export const TEST_TURTLE_DATA_INTERVAL = `
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX suff: <http://w3id.org/suff/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<geom>
    a geo:GeometryCollection ;
    rdfs:_1 [
        a geo:Geometry ;
        geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        rdf:value "0.75"^^xsd:double ;
    ] ;
.
`;

export const TEST_TURTLE_DATA_INTERVAL_SPECIFIED = `
PREFIX ex: <https://example.com/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX suff: <http://w3id.org/suff/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<geom>
    a geo:GeometryCollection ;
    suff:certaintyIndicator ex:specialCertainty ;
    rdfs:_1 [
        a geo:Geometry ;
        geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        ex:specialCertainty "0.75"^^xsd:double ;
    ] ;
.
`;

export const TEST_TURTLE_DATA_RATIO = `
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX suff: <http://w3id.org/suff/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<geom>
    a geo:GeometryCollection ;
    rdfs:_1 [
        a geo:Geometry ;
        geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        rdf:value "0"^^xsd:double ;
    ] ;
    rdfs:_2 [
        a geo:Geometry ;
        geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        rdf:value "0.75"^^xsd:double ;
    ] ;
    rdfs:_3 [
        a geo:Geometry ;
        geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        rdf:value "1"^^xsd:double ;
    ] ;
.
`;

export const TEST_JSONLD_DATA_NOMINAL = `
[
  {
    "@id": "https://example.com/feature/feature1",
    "@type": [
      "http://www.opengis.net/ont/geosparql#Feature"
    ],
    "http://www.opengis.net/ont/geosparql#hasGeometry": [
      {
        "@id": "_:na76614997e654c92b5756270a75e2ecdb1"
      }
    ]
  },
  {
    "@id": "_:na76614997e654c92b5756270a75e2ecdb1",
    "@type": [
      "http://www.opengis.net/ont/geosparql#GeometryCollection"
    ],
    "http://www.w3.org/2000/01/rdf-schema#member": [
      {
        "@id": "_:na76614997e654c92b5756270a75e2ecdb2"
      }
    ]
  },
  {
    "@id": "_:na76614997e654c92b5756270a75e2ecdb2",
    "@type": [
      "http://www.opengis.net/ont/geosparql#Geometry"
    ],
    "http://www.opengis.net/ont/geosparql#asWKT": [
      {
        "@type": "http://www.opengis.net/ont/geosparql#wktLiteral",
        "@value": "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"
      }
    ]
  }
]
`;
