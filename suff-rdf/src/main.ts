import { parse } from "./suff";
import { TEST_TURTLE_DATA_NOMINAL, TEST_JSONLD_DATA_NOMINAL, TEST_TURTLE_DATA_RATIO } from "./data";
import "./assets/main.scss";

function setupClearButton() {
    document.querySelector<HTMLButtonElement>("#clear")!.addEventListener("click", async () => {
        document.querySelector<HTMLPreElement>("#data")!.innerText = "";
        document.querySelector<HTMLPreElement>("#output")!.innerText = "";
    });
}

async function setupLoadTurtle() {
    document.querySelector<HTMLButtonElement>("#turtleButton")!.addEventListener("click", async () => {
        const g = await parse(TEST_TURTLE_DATA_NOMINAL, "text/turtle");
        document.querySelector<HTMLPreElement>("#data")!.innerText = TEST_TURTLE_DATA_NOMINAL;
        document.querySelector<HTMLPreElement>("#output")!.innerText = JSON.stringify(g, null, 4);
    });
}

async function setupLoadJsonld() {
    document.querySelector<HTMLButtonElement>("#jsonldButton")!.addEventListener("click", async () => {
        const g = await parse(TEST_JSONLD_DATA_NOMINAL, "application/json-ld");
        document.querySelector<HTMLPreElement>("#data")!.innerText = TEST_JSONLD_DATA_NOMINAL;
        document.querySelector<HTMLPreElement>("#output")!.innerText = JSON.stringify(g, null, 4);
    });
}

async function setupLoadTurtleRatio() {
    document.querySelector<HTMLButtonElement>("#turtleRatioButton")!.addEventListener("click", async () => {
        document.querySelector<HTMLPreElement>("#data")!.innerText = TEST_TURTLE_DATA_RATIO;
        const g = await parse(TEST_TURTLE_DATA_RATIO, "text/turtle");
        document.querySelector<HTMLPreElement>("#output")!.innerText = JSON.stringify(g, null, 4);
    });
}

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
    <h1>SUFF RDF</h1>
    <div>
        <button id="turtleButton">Load Turtle Nominal</button>
        <button id="jsonldButton">Load JSON-LD Nominal</button>
        <button id="turtleRatioButton">Load Turtle Ratio</button>
        <button id="clear">Clear</button>
    </div>
    <div id="content">
        <div>
            <h2>Data</h2>
            <pre id="data"></pre>
        </div>
        <div>
            <h2>Output</h2>
            <pre id="output"></pre>
        </div>
    </div>
`;

setupClearButton();
setupLoadTurtle();
setupLoadJsonld();
setupLoadTurtleRatio();
