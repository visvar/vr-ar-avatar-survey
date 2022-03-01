<script>
    import * as d3 from "d3";
    import * as druid from "@saehrimnir/druidjs/dist/druid.esm";
    import * as hagrid from "@saehrimnir/hagrid";
    import VisWrapper from "./VisWrapper.svelte";
    import { getImgSrc } from "./lib";
    import Select, { Option } from "@smui/select";

    export let data;
    export let width;
    export let shown;

    /** @type {"authors"|"keywords"|"fieldOfStudy"} */
    let coocurrencesOf = "keywords";

    $: height = width;
    const margin = 50;

    $: D = getCoocurrences(data, coocurrencesOf); // Distance-matrix

    function getCoocurrences(data, coocurrencesOf) {
        if (!data || data.length === 0) {
            return null;
        }
        console.log("compute D", coocurrencesOf);

        const set = Array.from(new Set(data.map((d) => d[coocurrencesOf]).flat()));
        console.log(set);

        let N = data.length;
        let D = new druid.Matrix(N, N, 0);
        for (let i = 0; i < N; ++i) {
            let vector_i = set.map((key) => (data[i][coocurrencesOf].includes(key) ? 1 : 0));
            for (let j = i + 1; j < N; ++j) {
                let vector_j = set.map((key) => (data[j][coocurrencesOf].includes(key) ? 1 : 0));
                const dist = druid.sokal_michener(vector_i, vector_j);
                D.set_entry(i, j, dist);
                D.set_entry(j, i, dist);
            }
        }
        console.log(D);
        return D;
    }

    let Y = [];
    let grid_size = 0;

    $: {
        if (data && data.length > 0) {
            const projection = druid.UMAP.transform(D, 15, 1, 1, 2, "precomputed").asArray;
            console.log("projection", projection);
            grid_size = Math.pow(Math.ceil(Math.log2(data.length) / Math.log2(4)), 2);
            const gridified = hagrid.gridify(projection, "hilbert");
            console.log("gridified", gridified, grid_size);
            Y = [...gridified];
        } else {
            Y = [];
        }
    }

    function get_scales(Y, [lo, hi]) {
        let [x_min, x_max] = d3.extent(Y, (d) => d[0]);
        let [y_min, y_max] = d3.extent(Y, (d) => d[1]);
        const x_span = x_max - x_min;
        const y_span = y_max - y_min;

        const o = Math.abs(x_span - y_span) / 2;
        if (x_span > y_span) {
            y_min -= o;
            y_max += o;
        } else {
            x_min -= o;
            x_max += o;
        }
        return {
            x: d3.scaleLinear().domain([x_min, x_max]).range([lo, hi]),
            y: d3.scaleLinear().domain([y_min, y_max]).range([hi, lo]),
        };
    }
    $: scales = get_scales(Y, [margin, width - margin]);
    $: conferences = Array.from(new Set(data.map((d) => d.conference)));
    $: colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(conferences);
</script>

<main>
    <VisWrapper title="DR chart" {shown}>
        <div slot="control">
            <Select bind:value={coocurrencesOf} label="Connections for">
                <Option value="keywords">Keywords</Option>
                <Option value="fieldOfStudy">Field of Study</Option>
                <Option value="authors">Authors</Option>
            </Select>
        </div>
        <div slot="content">
            {#if data.length > 0}
                <div id="grid-container" style="grid-template-rows: repeat({grid_size}, 6em); grid-template-columns: repeat({grid_size}, 1fr);">
                    {#each data as publication, i}
                        <div class="grid-img-container" style="grid-column: {Y[i][0]}; grid-row: {grid_size - Y[i][1]};">
                            <img class="publication-image" src={getImgSrc(publication.doi)} alt="" />
                        </div>
                    {/each}
                </div>
                <div id="legend">
                    {#each conferences as value}
                        <div><span style="color: {colorScale(value)}">●</span> {value}</div>
                    {/each}
                </div>
            {/if}
        </div>
    </VisWrapper>
</main>

<style>
    .separator {
        flex-grow: 1;
    }
    .toolbar {
        display: flex;
        gap: 1em;
        padding: 1em;
    }
    #legend {
        padding: 1em;
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 0.5em;
    }

    #grid-container {
        width: 100%;
        aspect-ratio: 1;
        display: grid;
        gap: 0.15em;
    }

    .publication-image {
        width: 100%;
        height: 100%;
        max-height: 4em;
        object-fit: scale-down;
        object-position: center;
    }

    .grid-img-container > img {
        transition: all 185ms ease-in-out;
    }

    .grid-img-container:hover > img {
        transform: scale(2);
        filter: drop-shadow(0 0.4em 4px #666);
    }
</style>
