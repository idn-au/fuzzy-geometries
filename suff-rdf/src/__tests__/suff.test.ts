import { describe, expect, test } from "vitest";
import type { Quad_Object } from "n3";
import { levelOfMeasurement, convert, nominal, ordinal, interval, ratio, generateGeomExtremes } from "../suff";
import { RDFStore } from "../store";
import { TEST_TURTLE_DATA_NOMINAL, TEST_TURTLE_DATA_ORDINAL, TEST_TURTLE_DATA_INTERVAL, TEST_TURTLE_DATA_RATIO } from "../data";

describe("levelOfMeasurement", () => {
    async function setupLoMTest(data: string): Promise<{ store: RDFStore, geometryCollection: Quad_Object }> {
        const store = new RDFStore();
        await store.load(data, "turtle");
        const feature = store.getSubject("http://www.w3.org/1999/02/22-rdf-syntax-ns#type", "http://www.opengis.net/ont/geosparql#Feature")!;
        const geometryCollection = store.getObject(feature.id, "http://www.opengis.net/ont/geosparql#hasGeometry")!;
        return { store, geometryCollection };
    }

    test("LoM to be nominal", async () => {
        const { store, geometryCollection } = await setupLoMTest(TEST_TURTLE_DATA_NOMINAL);
        expect(levelOfMeasurement(store, geometryCollection)).toBe("nominal");
    });

    test("LoM to be ordinal", async () => {
        const { store, geometryCollection } = await setupLoMTest(TEST_TURTLE_DATA_ORDINAL);
        expect(levelOfMeasurement(store, geometryCollection)).toBe("ordinal");
    });

    test("LoM to be interval", async () => {
        const { store, geometryCollection } = await setupLoMTest(TEST_TURTLE_DATA_INTERVAL);
        expect(levelOfMeasurement(store, geometryCollection)).toBe("interval");
    });

    test("LoM to be ratio", async () => {
        const { store, geometryCollection } = await setupLoMTest(TEST_TURTLE_DATA_RATIO);
        expect(levelOfMeasurement(store, geometryCollection)).toBe("ratio");
    });
});

describe.todo("convert");

describe.todo("nominal");

describe.todo("ordinal");

describe.todo("interval");

describe.todo("ratio");

describe.todo("generateGeomExtremes");

describe.todo("generateTIN");

describe.todo("generateInterpolatedGrid");

describe.todo("generateContours");
