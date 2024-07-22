import { describe, expect, test } from "vitest";
import { RDFStore } from "../store";

describe("parser", () => {
    test("parse turtle", async () => {
        const data = `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            <https://example.com/someConcept> a skos:Concept .`;
        const store = new RDFStore();
        await store.load(data, "text/turtle");
        expect(store.store.size).toBe(1);
    });

    test("parse trig", async () => {
        const data = `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
        <https://example.com/graph> {
            <https://example.com/someConcept> a skos:Concept .
        }`;
        const store = new RDFStore();
        await store.load(data, "application/trig");
        expect(store.store.size).toBe(1);
    });

    test("parse n-triples", async () => {
        const data = `<https://example.com/someConcept> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2004/02/skos/core#Concept> .`;
        const store = new RDFStore();
        await store.load(data, "application/n-triples");
        expect(store.store.size).toBe(1);
    });

    test("parse n-quads", async () => {
        const data = `<https://example.com/someConcept> <http://www.w3.org/1999/02/22-rdf-syntax-ns#type> <http://www.w3.org/2004/02/skos/core#Concept> <https://example.com/graph> .`;
        const store = new RDFStore();
        await store.load(data, "application/n-quads");
        expect(store.store.size).toBe(1);
    });

    test("parse N3", async () => {
        const data = `@prefix skos: <http://www.w3.org/2004/02/skos/core#> .
            <https://example.com/someConcept> a skos:Concept .`;
        const store = new RDFStore();
        await store.load(data, "text/n3");
        expect(store.store.size).toBe(1);
    });

    test("parse JSON-LD", async () => {
        const data = `[
            {
                "@id": "https://example.com/someConcept",
                "@type": [
                    "http://www.w3.org/2004/02/skos/core#Concept"
                ]
            }
        ]`;
        const store = new RDFStore();
        await store.load(data, "application/ld+json");
        expect(store.store.size).toBe(1);
    });

    test("parse invalid format option", async () => {
        const data = `PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
            <https://example.com/someConcept> a skos:Concept .`;
        const store = new RDFStore();
        // @ts-expect-error
        await expect(() => store.load(data, "blah")).rejects.toThrowError();
    });

    test("parse invalid turtle", async () => {
        const data = `PREFIXs skos: <http://www.w3.org/2004/02/skos/core#>
            https://example.com/someConcept> a skos:Concept aasdasd asdasdasd`;
        const store = new RDFStore();
        await expect(() => store.load(data, "text/turtle")).rejects.toThrowError();
    });
});
