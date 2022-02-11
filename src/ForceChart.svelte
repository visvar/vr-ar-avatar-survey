<script>
  import * as d3 from "d3";
  import Select, { Option } from "@smui/select";
  import VisWrapper from "./VisWrapper.svelte";

  export let data;
  export let width;
  export let shown;

  /** @type {"authors"|"keywords"|"fieldOfStudy"} */
  let connectionsBy = "keywords";
  let minCountForLink = 0;

  $: height = width;

  $: links = getLinks(data, connectionsBy);
  let render_nodes = [];
  let render_links = [];

  $: x = d3.scaleLinear().range([20, width - 20]);
  $: y = d3.scaleLinear().range([20, height - 20]);

  $: simulation = d3
    .forceSimulation()
    .nodes(data)
    .force(
      "link",
      d3.forceLink(links).distance((d) => 1 / d.value)
    )
    .force("charge", d3.forceManyBody())
    //.force("collide", d3.forceCollide().radius(20))
    .force("center", d3.forceCenter(width / 2, height / 2))
    .on("tick", () => {
      render_nodes = [...data];
      render_links = [...links];
      x.domain(d3.extent(render_nodes, (d) => d.x));
      y.domain(d3.extent(render_nodes, (d) => d.y));
    });

  function getLinks(data, connectionsBy) {
    const links = [];
    const n = data.length;
    for (let i = 0; i < n; ++i) {
      for (let j = i + 1; j < n; ++j) {
        const intersection = d3.intersection(
          data[i][connectionsBy],
          data[j][connectionsBy]
        );
        if (intersection.size > 0) {
          links.push({
            source: i,
            target: j,
            value: intersection.size,
          });
        }
      }
    }
    if (simulation) {
      simulation.alpha(1);
      simulation.restart();
    }
    return links;
  }

  $: conferences = Array.from(new Set(data.map((d) => d.conference)));
  $: colorScale = d3.scaleOrdinal(d3.schemeTableau10).domain(conferences);
</script>

<main>
  <VisWrapper title="Force Directed Chart" {shown}>
    <div slot="control">
      <Select bind:value={connectionsBy} label="Connections for">
        <Option value="keywords">Keywords</Option>
        <Option value="fieldOfStudy">Field of Study</Option>
        <Option value="authors">Authors</Option>
      </Select>
      <Select
        bind:value={minCountForLink}
        label="hide links with less than"
        title="hide links with less than"
      >
        {#each d3.range(0, 10) as option}
          <Option value={option}>
            {option}
          </Option>
        {/each}
      </Select>
    </div>
    <div slot="content">
      <svg {width} {height}>
        <!-- Links -->
        <g>
          {#each render_links as { value, source: { x: x1, y: y1 }, target: { x: x2, y: y2 } }}
            {#if value > minCountForLink}
              <path
                d="M {x(x1)} {y(y1)} L {x(x2)} {y(y2)}"
                fill="none"
                stroke="#ddd"
                strokeWidth={value}
              />
            {/if}
          {/each}
        </g>
        <!-- Nodes -->
        <g>
          {#each render_nodes as node, i}
            <circle
              cx={x(node.x)}
              cy={y(node.y)}
              r="4"
              fill={colorScale(node.conference)}
            >
              <title>
                {node.title} ({node.year}){"\n\n"}
                {node[connectionsBy].join(", ")}
              </title>
            </circle>
          {/each}
        </g>
      </svg>
      <!-- Legend -->
      <div class="legend">
        {#each conferences as value}
          <div>
            <span style="color: {colorScale(value)}">●</span>
            {value}
          </div>
        {/each}
      </div>
    </div>
  </VisWrapper>
</main>

<style>
  .legend {
    padding: 1em;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5em;
  }
</style>
