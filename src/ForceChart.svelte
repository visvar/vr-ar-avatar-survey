<script>
    import * as d3 from "d3";
    import VisWrapper from "./VisWrapper.svelte";

    export let data;
    export let width;
    export let shown;

    /** @type {"authors"|"keywords"|"fieldOfStudy"} */
    let connectionsBy = "keywords";

    $: height = width;

    $: links = getLinks(data, connectionsBy);

    function getLinks(data, connectionsBy) {
        const links = [];
        const n = data.length;
        for (let i = 0; i < n; ++i) {
            for (let j = i + 1; j < n; ++j) {
                const intersection = d3.intersection(data[i][connectionsBy], data[j][connectionsBy]);
                if (intersection.size > 0) {
                    links.push({
                        source: i,
                        target: j,
                        value: intersection.size,
                    });
                }
            }
        }
        console.log(links);
        return links;
    }

    function force(node, { data, links }) {
        const links_g = d3.select(node).append("g");
        const nodes_g = d3.select(node).append("g");
        function runSimulation({ data, links }) {
            const linkPaths = links_g.selectAll("path").data(links).join("path").attr("fill", "none").attr("stroke", "#ddd");
            const nodes = nodes_g
                .selectAll("circle")
                .data(data)
                .join("circle")
                .attr("r", 4)
                .attr("fill", (d) => colorScale((d) => d.conference));
            nodes.append("title").text((d) => d.title + "\n" + d.authors + "\n" + d.keywords + "\n" + d.fieldOfStudy);

            d3.forceSimulation(data)
                .force(
                    "link",
                    d3.forceLink(links).distance((d) => 10 / d.value)
                )
                .force("charge", d3.forceManyBody())
                .force("collide", d3.forceCollide().radius(20))
                .force("center", d3.forceCenter(width / 2, height / 2))
                .on("tick", () => {
                    linkPaths.attr("d", ({ source, target }) => `M ${source.x} ${source.y} L ${target.x} ${target.y}`);
                    nodes.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
                });
        }
        runSimulation({ data, links });
        return {
            update: runSimulation,
        };
    }

    $: conferences = Array.from(new Set(data.map((d) => d.conference)));
    $: colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(conferences);
</script>

<main>
    <VisWrapper title="Force Directed Chart" {shown}>
        <div class="toolbar">
            <div class="separator" />
            <label>
                connections By
                <select bind:value={connectionsBy}>
                    <option value="keywords">Keywords</option>
                    <option value="fieldOfStudy">Field of Study</option>
                    <option value="authors">Authors</option>
                </select>
            </label>
        </div>
        <svg {width} {height}>
            <g use:force={{ data, links }} />
        </svg>
        <div id="legend">
            {#each conferences as value}
                <div><span style="color: {colorScale(value)}">●</span> {value}</div>
            {/each}
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
</style>
