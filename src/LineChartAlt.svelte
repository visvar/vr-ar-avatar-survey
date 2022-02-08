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

    $: width = 200;
    $: height = 80;
    const margin = {top: 10, bottom: 25, left: 25, right: 1};

    $: y = d3
        .scaleLinear()
        .domain([0, d3.max(groupedData.flat(), (d) => d[2])])
        .range([height - margin.bottom, margin.top]);

    $: years = d3.extent(data, (d) => d.year);
    $: x = d3
        .scaleLinear()
        .domain(years)
        .range([margin.left, width - margin.right]);

    $: line = d3
        .line()
        .x((d) => x(d[0]))
        .y((d) => y(d[2]))
        .defined((d) => d[2]);

    function axis(node, { axis, scale, ticks }) {
        const g = d3.select(node);
        function drawAxis({ axis, scale, ticks }) {
            g.call(axis(scale).ticks(ticks));
        }
        drawAxis({ axis, scale, ticks });
        return {
            update: drawAxis,
        };
    }
</script>


<div id="legend">
    {#each groupedData as row, i}
        <div class="cell">
            
            <div>{row.value}</div>
            <svg {width} {height} viewbox="0 0 {width} {height}">
                {#each groupedData as row, j}
                    {#if i != j}
                    <g>
                        <path d={line(row)} fill="none" stroke="#ddd" />
                        {#each row as [year, rank, number]}
                            {#if number}
                                <circle cx={x(year)} cy={y(number)} r=1.5 fill="#ddd" />
                            {/if}
                        {/each}
                    </g>
                    {/if}
                {/each}
                <path d={line(row)} fill="none" stroke={colorScale(row.value)} />
                {#each row as [year, rank, number]}
                    {#if number}
                        <circle cx={x(year)} cy={y(number)} r=2.5 fill={colorScale(row.value)} />
                    {/if}
                {/each}
                <g transform="translate(0, {height - margin.bottom})" use:axis={{ axis: d3.axisBottom, scale: x, ticks: 2 }} />
                <g transform="translate({margin.left}, 0)" use:axis={{ axis: d3.axisLeft, scale: y, ticks: 1 }} />
            </svg>
        
        </div>
    {/each}
</div>

<style>
    #legend {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }

    .cell {
        display: flex;
        flex-direction: column;
    }

    .cell > div {
        font-weight: bold;
    }
</style>