<script>
    import * as d3 from "d3";

    /** @type {"keywords"|"fieldOfStudy"} */
    export let groupBy = "fieldOfStudy";
    export let data;
    /** @type {Number} */
    export let topN = 10;

    /**
     * extracts topN values definded by groupBy of data.
     * @param data
     * @param groupBy
     * @param topN
     * @returns The topN values defined by groupBy, with their occurences each available year.
     */
    function getDataGroupByTopN(data, groupBy, topN) {
        const years = Array.from(new Set(data.map((d) => d.year))).sort();

        const flatData = data
            .map((row) => d3.cross([row.year], row[groupBy])) // only needed values
            .flat();

        const groupedDataTopN = d3
            .rollups(
                flatData,
                (d) => d.length, // count
                (d) => d[0], // year
                (d) => d[1] // value
            )
            .map((row) => [row[0], row[1].sort((a, b) => d3.descending(a[1], b[1]))]) // sort by occurence
            .map(([year, values]) => d3.cross([year], d3.zip(values.slice(0, topN), d3.range(1, topN + 1)))) // select topN
            .map((row) => row.map((x) => x.flat(Infinity))) // \m/ Frank
            .flat();

        const values = Array.from(new Set(groupedDataTopN.map((d) => d[1])));
        return values.map((value) => {
            const history = years.map((year) => {
                const entry = groupedDataTopN.find((row) => row[0] == year && row[1] == value);
                return [year, entry ? entry[3] : undefined, entry ? entry[2] : undefined]; // [year, rank, number]
            });
            history.value = value;
            return history;
        });
    }

    $: groupedData = getDataGroupByTopN(data, groupBy, topN);
    $: colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(groupedData.map((d) => d.value));

    $: width = Math.min(window.innerWidth - 330, window.innerHeight - 100);
    $: height = width / 3;
    const margin = 50;

    $: y = d3
        .scalePoint()
        .domain(d3.range(1, topN + 1))
        .range([margin, height - margin]);

    $: years = d3.extent(data, (d) => d.year);
    $: x = d3
        .scaleLinear()
        .domain(years)
        .range([margin, width - margin]);

    $: line = d3
        .line()
        .x((d) => x(d[0]))
        .y((d) => y(d[1]))
        .defined((d) => d[1]);

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

<svg {width} {height}>
    {#each groupedData as values, j}
        <path d={line(values)} fill="none" stroke={colorScale(values.value)} stroke-width="8" opacity="0.2" />
        {#each values as [year, value, number]}
            {#if value}
                <g transform="translate({x(year)}, {y(value)})" font-size="10" dominant-baseline="central">
                    <circle fill={colorScale(values.value)} r="4" />
                    <text x="8">{values.value} ({number})</text>
                </g>
            {/if}
        {/each}
    {/each}
    <g transform="translate(0, {height - margin})" use:axis={{ axis: d3.axisBottom, scale: x }} />
    <g transform="translate({margin}, 0)" use:axis={{ axis: d3.axisLeft, scale: y }} />
</svg>
