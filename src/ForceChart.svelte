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
  let render_nodes = [];
  let render_links = [];

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
    console.log(links);
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
    <div slot="content">
      <svg {width} {height}>
        <g>
          {#each render_links as { source: { x: x1, y: y1 }, target: { x: x2, y: y2 } }}
            <path d="M {x1} {y1} L {x2} {y2}" fill="none" stroke="#ddd" />
          {/each}
        </g>
        <g>
          {#each render_nodes as node, i}
            <circle
              cx={node.x}
              cy={node.y}
              r="4"
              fill={colorScale(node.conference)}
            >
              <title>
                {node.title}{"\n"}
                {node[connectionsBy]}
              </title>
            </circle>
          {/each}
        </g>
      </svg>
      <div class="legend">
        {#each conferences as value}
          <div><span style="color: {colorScale(value)}">●</span> {value}</div>
        {/each}
      </div>
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
  .legend {
    padding: 1em;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5em;
  }
</style>
