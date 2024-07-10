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
PREFIX sdo: <https://schema.org/>
PREFIX suff: <http://w3id.org/suff/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<https://example.com/feature/feature1>
    a geo:Feature ;
    sdo:name "Test nominal feature" ;
    geo:hasGeometry [
        a geo:GeometryCollection ;
        rdfs:_1 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((153.01369401120402 -27.26991873818224, 152.82541942431703 -27.30562430458849, 152.81992235608675 -27.48689871865099, 152.89688131131064 -27.69563895302599, 153.0947757676006 -27.710745154197866, 153.29954155917844 -27.614614783104116, 153.32152983209954 -27.381155310447866, 153.18547739340016 -27.282278357322866, 153.01369401120402 -27.26991873818224))"^^geo:wktLiteral ;
            rdf:value "0"^^xsd:double ;
        ] ;
        rdfs:_2 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((153.0370565511827 -27.37978201943224, 152.96422039713153 -27.422354040916616, 152.96696893124667 -27.55007010536974, 153.0769102958522 -27.595388708885366, 153.14699791578823 -27.49788504677599, 153.13188097815498 -27.405874548729116, 153.0370565511827 -27.37978201943224))"^^geo:wktLiteral ;
            rdf:value "0.75"^^xsd:double ;
        ] ;
        rdfs:_3 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((153.0411793523554 -27.455313025291616, 153.02056534649185 -27.471792517479116, 153.02606241472213 -27.504751501854116, 153.06041909116138 -27.50887137490099, 153.0727874946795 -27.477285681541616, 153.06041909116138 -27.45943289833849, 153.0411793523554 -27.455313025291616))"^^geo:wktLiteral ;
            rdf:value "1"^^xsd:double ;
        ] ;
    ];
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
