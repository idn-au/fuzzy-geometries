import { Store, Parser, DataFactory, type Quad_Object, Quad_Subject } from "n3";
import { JsonLdParser } from "jsonld-streaming-parser";
import { promisifyEventEmitter } from 'event-emitter-promisify';
import { DEFAULT_PREFIXES } from "./consts";

const { namedNode } = DataFactory;

export class RDFStore {
    public store: Store;
    // public prefixes: { [namespace: string]: string };

    constructor() {
        this.store = new Store();
        // this.prefixes = DEFAULT_PREFIXES;
    }

    public async load(data: string, format?: string) {
        if (format && /json/.test(format)) { // JSON-LD
            const parser = new JsonLdParser();
            parser.write(data);
            parser.end();
            await promisifyEventEmitter(this.store.import(parser));
        } else {
            const parser = new Parser({ format: format });
            const p = parser.parse(data);
            this.store.addQuads(p);
        }
    }

    public getSubjects(predicate: string, object: string): Quad_Subject[] {
        return this.store.getSubjects(namedNode(predicate), namedNode(object), null);
    }

    public getSubject(predicate: string, object: string): Quad_Subject | undefined {
        const subjs = this.store.getSubjects(namedNode(predicate), namedNode(object), null);
        if (subjs.length === 0) {
            return undefined;
        } else {
            return subjs[0];
        }
    }

    public getObjects(subject: string, predicate: string | string[]): Quad_Object[] {
        if (typeof predicate === "string") {
            return this.store.getObjects(namedNode(subject), namedNode(predicate), null);
        } else {
            const objs: Quad_Object[] = [];
            predicate.forEach(p => {
                objs.push(...this.store.getObjects(namedNode(subject), namedNode(p), null));
            });
            return objs;
        }
    }

    public getObject(subject: string, predicate: string | string[]): Quad_Object | undefined {
        let objs: Quad_Object[] = [];
        if (typeof predicate === "string") {
            objs = this.store.getObjects(namedNode(subject), namedNode(predicate), null);
        } else {
            predicate.forEach(p => {
                objs.push(...this.store.getObjects(namedNode(subject), namedNode(p), null));
            });
        }
        if (objs.length === 0) {
            return undefined;
        } else {
            return objs[0];
        }
    }

    public getLabel(subject: string): Quad_Object | undefined {
        const labelPredicates = [
            "http://purl.org/dc/terms/title",
            "http://www.w3.org/2000/01/rdf-schema#label",
            "https://schema.org/name",
            "http://www.w3.org/2004/02/skos/core#prefLabel",
        ];
        return this.getObject(subject, labelPredicates);
    }
}
