<script>
  import * as d3 from "d3";
  import * as druid from "@saehrimnir/druidjs/dist/druid.esm";
  import VisWrapper from "./VisWrapper.svelte";

  export let data;
  export let width;
  export let shown;

  /** @type {"authors"|"keywords"|"fieldOfStudy"} */
  let coocurrencesOf = "keywords";

  $: height = width;
  const margin = 50;

  $: D = getCoocurrences(data, coocurrencesOf); // Distance-matrix

  function getCoocurrences(data, coocurrencesOf) {
    console.log("compute D", coocurrencesOf);

    const set = Array.from(new Set(data.map((d) => d[coocurrencesOf]).flat()));
    console.log(set);

    let N = data.length;
    let D = new druid.Matrix(N, N, 0);
    for (let i = 0; i < N; ++i) {
      let vector_i = set.map((key) =>
        data[i][coocurrencesOf].includes(key) ? 1 : 0
      );
      for (let j = i + 1; j < N; ++j) {
        let vector_j = set.map((key) =>
          data[j][coocurrencesOf].includes(key) ? 1 : 0
        );
        const dist = druid.sokal_michener(vector_i, vector_j);
        D.set_entry(i, j, dist);
        D.set_entry(j, i, dist);
      }
    }
    console.log(D);
    return D;
  }

  let Y = [];

  $: {
    const projection = druid.UMAP.transform(
      D,
      15,
      1,
      1,
      2,
      "precomputed"
    ).to2dArray.map((row) => Array.from(row));
    console.log("projection", projection);
    Y = [...projection];
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
      <div class="separator" />
      <label>
        coocurrences of
        <select bind:value={coocurrencesOf}>
          <option value="keywords">Keywords</option>
          <option value="fieldOfStudy">Field of Study</option>
          <option value="authors">Authors</option>
        </select>
      </label>
    </div>
    <div slot="content">
      <svg {width} {height}>
        {#each Y as [px, py], i}
          <circle
            cx={scales.x(px)}
            cy={scales.y(py)}
            r="4"
            fill={colorScale(data[i].conference)}
          >
            <title>
              {data[i].title}{"\n"}
              {data[i][coocurrencesOf]}
            </title>
          </circle>
        {/each}
      </svg>
      <div id="legend">
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
  #legend {
    padding: 1em;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 0.5em;
  }
</style>
