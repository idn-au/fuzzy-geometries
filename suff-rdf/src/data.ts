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
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sdo: <https://schema.org/>
PREFIX suff: <http://w3id.org/suff/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<https://example.com/feature/feature1>
    a geo:Feature ;
    sdo:name "Test ordinal feature" ;
    geo:hasGeometry [
        a geo:GeometryCollection ;
        rdfs:_1 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        ] ;
        rdfs:_2 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        ] ;
        rdfs:_3 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
        ] ;
    ];
.
`;

export const TEST_TURTLE_DATA_INTERVAL = `
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sdo: <https://schema.org/>
PREFIX suff: <http://w3id.org/suff/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<https://example.com/feature/feature1>
    a geo:Feature ;
    sdo:name "Test interval feature" ;
    geo:hasGeometry [
        a geo:GeometryCollection ;
        rdfs:_1 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
            rdf:value "0.3"^^xsd:double ;
        ] ;
        rdfs:_2 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
            rdf:value "0.5"^^xsd:double ;
        ] ;
        rdfs:_3 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
            rdf:value "0.8"^^xsd:double ;
        ] ;
    ];
.
`;

export const TEST_TURTLE_DATA_INTERVAL_SPECIFIED = `
PREFIX ex: <https://example.com/>
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sdo: <https://schema.org/>
PREFIX suff: <http://w3id.org/suff/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<https://example.com/feature/feature1>
    a geo:Feature ;
    sdo:name "Test interval specified certainty predicate feature" ;
    geo:hasGeometry [
        a geo:GeometryCollection ;
        suff:certaintyIndicator ex:specialCertainty ;
        rdfs:_1 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
            ex:specialCertainty "0.3"^^xsd:double ;
        ] ;
        rdfs:_2 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
            ex:specialCertainty "0.5"^^xsd:double ;
        ] ;
        rdfs:_3 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((152.9532532520832 -27.3399868010302, 152.9532532520832 -27.53219499593302, 153.13510877979905 -27.53219499593302, 153.13510877979905 -27.3399868010302, 152.9532532520832 -27.3399868010302))"^^geo:wktLiteral ;
            ex:specialCertainty "0.8"^^xsd:double ;
        ] ;
    ];
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
    sdo:name "Test ratio feature" ;
    geo:hasGeometry [
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

export const TEST_TURTLE_DATA_ORDINAL_PERP = `
PREFIX geo: <http://www.opengis.net/ont/geosparql#>
PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>
PREFIX rdfs: <http://www.w3.org/2000/01/rdf-schema#>
PREFIX sdo: <https://schema.org/>
PREFIX suff: <http://w3id.org/suff/>
PREFIX xsd: <http://www.w3.org/2001/XMLSchema#>

<https://example.com/feature/feature1>
    a geo:Feature ;
    sdo:name "Test ordinal feature" ;
    geo:hasGeometry [
        a geo:GeometryCollection ;
        rdfs:_1 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((153.0160883320784 -27.308370886619734, 153.0035898712687 -27.313574686477292, 152.99525756406223 -27.32190076624938, 152.98692525685576 -27.33751216582205, 152.9827591032525 -27.35312356539472, 152.97963448805007 -27.36873496496739, 152.97755141124847 -27.387468644454597, 152.97963448805007 -27.400998524084244, 152.97859294964928 -27.415569163685404, 152.97859294964928 -27.432221323229584, 152.97859294964928 -27.447832722802254, 152.97546833444684 -27.46552564231795, 152.97442679604603 -27.48321856183364, 152.97755141124847 -27.495707681491776, 152.97963448805007 -27.509237561121424, 152.98067602645088 -27.525889720665607, 152.98588371845494 -27.540460360266763, 152.9931744872606 -27.553990239896414, 153.0046314096695 -27.56127555969699, 153.01921294728083 -27.562316319668504, 153.0369191000946 -27.55815327978246, 153.04941756090432 -27.555030999867924, 153.06295756011482 -27.55190871995339, 153.07545602092455 -27.55086795998188, 153.09003755853587 -27.55086795998188, 153.10149448094478 -27.54254188020979, 153.10878524975044 -27.531093520523164, 153.11190986495288 -27.516522880922004, 153.1129514033537 -27.502993001292356, 153.11086832655207 -27.48946312166271, 153.10878524975044 -27.471770202147017, 153.10774371134963 -27.456158802574347, 153.10461909614722 -27.439506643030164, 153.10045294254397 -27.42077296354296, 153.09524525053993 -27.408283843884824, 153.09107909693668 -27.38850940442611, 153.08795448173427 -27.37393876482495, 153.08691294333346 -27.3604088851953, 153.07962217452777 -27.34583824559414, 153.07545602092455 -27.331267605992984, 153.06608217531726 -27.32086000627787, 153.05670832970998 -27.31149316653427, 153.04316833049944 -27.3052486067052, 153.03066986968975 -27.3052486067052, 153.0160883320784 -27.308370886619734))"^^geo:wktLiteral ;
        ] ;
        rdfs:_2 [
            a geo:Geometry ;
            geo:asWKT "POLYGON ((153.1681529385966 -27.42701752337203, 153.17440216900144 -27.43742512308714, 153.1806513994063 -27.4426289229447, 153.18898370661276 -27.464484882346436, 153.19523293701764 -27.479055521947597, 153.20148216742248 -27.49154464160573, 153.2035652442241 -27.50507452123538, 153.19939909062086 -27.52172668077956, 153.18898370661276 -27.53005276055165, 153.17440216900144 -27.539419600295254, 153.1577375545885 -27.548786440038857, 153.13898986337392 -27.557112519810946, 153.11815909535773 -27.55919403975397, 153.09941140414315 -27.55815327978246, 153.0827467897302 -27.562316319668504, 153.06608217531726 -27.565438599583036, 153.05045909930513 -27.56856087949757, 153.03587756169378 -27.572723919383616, 153.01921294728083 -27.57480543932664, 153.00567294807033 -27.571683159412107, 152.99004987205817 -27.563357079640014, 152.97859294964928 -27.5529494799249, 152.97442679604603 -27.54254188020979, 152.97338525764522 -27.531093520523164, 152.97650987284766 -27.52068592080805, 152.98380064165332 -27.50507452123538, 152.98588371845494 -27.49674844146329, 152.99004987205817 -27.48425932180515, 153.00775602487192 -27.467607162260972, 153.02025448568165 -27.45824032251737, 153.0369191000946 -27.45095500271679, 153.05566679130916 -27.447832722802254, 153.07962217452777 -27.449914242745276, 153.1035775577464 -27.448873482773767, 153.12128371056016 -27.439506643030164, 153.1369067865723 -27.43013980328656, 153.15565447778687 -27.423895243457494, 153.1681529385966 -27.42701752337203))"^^geo:wktLiteral ;
        ] ;
    ];
.
`;