<script>
  import * as d3 from "d3";
  import axis from "./axis.js";

  export let data;
  export let width;
  export let topN = 5;
  export let groupBy = "keywords";

  $: height = topN * 30;

  let margin = {
    top: 1,
    left: 150,
    right: 10,
    bottom: 20,
  };

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
</script>

<main>
  <svg {width} {height}>
    {#each topNvalues as [name, value]}
      <g>
        <path
          d="M {x_values(0)} {y_values(name)} H {x_values(
            value
          )} v {h_values} H {x_values(0)} Z"
          fill="var(--accentColor)"
        />
        <text
          text-anchor="end"
          dominant-baseline="central"
          x={x_values(value) - 5}
          y={y_values(name) + h_values / 2}
          fill="white"
        >
          {value}
        </text>
      </g>
    {/each}
    <g
      transform="translate({margin.left}, 0)"
      use:axis={{ axis: d3.axisLeft, scale: y_values }}
    />
  </svg>
</main>

<style>
  svg g.tick text {
    font-size: 14px !important;
  }

  path,
  g {
    transition: all 350ms;
  }
</style>
