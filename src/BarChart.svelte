<script>
    import * as d3 from "d3";
    import VisWrapper from "./VisWrapper.svelte";

    export let data;
    export let shown;
    export let width = Math.min(window.innerWidth - 330, window.innerHeight - 100);
    export let height = width / 3;
    export let groupBy = "keywords";
    let margin = {
        top: 1,
        left: 150,
        right: 10,
        bottom: 20,
    }

    const colorScale = d3.scaleOrdinal(d3.schemeTableau10)

    let topN = 5;

    $: values = data.reduce(
        counter((d) => d[groupBy]),
        new Map()
    );

    function counter(accessor) {
        return function (map, items) {
            for (const item of accessor(items)) {
                if (map.has(item)) {
                    let count = map.get(item);
                    map.set(item, count + 1);
                } else {
                    map.set(item, 1);
                }
            }
            return map;
        };
    }

    $: topNvalues = Array.from(values.entries())
        .sort((a, b) => d3.descending(a[1], b[1]))
        .slice(0, topN);

    $: x_values = d3
        .scaleLinear()
        .domain([0, d3.max(topNvalues, (d) => d[1])])
        .range([margin.left, width - margin.right]);
    $: y_values = d3
        .scaleBand()
        .paddingInner(0.1)
        .paddingOuter(0.2)
        .domain(topNvalues.map((d) => d[0]))
        .range([margin.top, height - margin.bottom]);
    $: h_values = y_values.bandwidth();

    function axis(node, { axis, scale }) {
        const g = d3.select(node);
        function drawAxis({ axis, scale }) {
            g.call(axis(scale));
        }
        drawAxis({ axis, scale });
        return {
            update: drawAxis,
        };
    }
</script>

<main>
    <VisWrapper title={`Bar Chart: ${groupBy}`} {shown}>
        <div class="toolbar">
            <div class="separator" />
            <label>
                top N
                <select bind:value={topN}>
                    {#each d3.range(3, 11) as n}
                        <option value={n}>{n}</option>
                    {/each}
                </select>
            </label>
        </div>
        <div />
        <svg {width} {height}>
            {#each topNvalues as [name, value]}
            <g>
                <path d="M {x_values(0)} {y_values(name)} H {x_values(value)} v {h_values} H {x_values(0)} Z" fill={colorScale(name)} />
                <text 
                    text-anchor="end"
                    dominant-baseline="central"
                    x={x_values(value) - 5} 
                    y={y_values(name) + h_values / 2}                    
                    fill="black">
                    {value}
                </text>
            </g>

            {/each}
            <g transform="translate({margin.left}, 0)" use:axis={{ axis: d3.axisLeft, scale: y_values }} />
            <!-- <g transform="translate(0, {height - margin.bottom})" use:axis={{ axis: d3.axisBottom, scale: x_values }} /> -->
        </svg>
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
</style>

