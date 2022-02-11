<script>
  import * as d3 from "d3";
  import VisWrapper from "./VisWrapper.svelte";
  import BarChartSvg from "./BarChartSvg.svelte";

  export let data;
  export let shown;
  export let width = Math.min(
    window.innerWidth - 330,
    window.innerHeight - 100
  );

  // const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  let topN = 5;
</script>

<main>
  <VisWrapper title="Top Lists" {shown}>
    <div slot="control">
      <label>
        top
        <select bind:value={topN}>
          {#each d3.range(3, 11) as n}
            <option value={n}>{n}</option>
          {/each}
        </select>
      </label>
    </div>
    <div slot="content">
      <h3>Top {topN} Keywords</h3>
      <BarChartSvg {data} {topN} groupBy="keywords" {width} />
      <h3>Top {topN} Authors</h3>
      <BarChartSvg {data} {topN} groupBy="authors" {width} />
      <h3>Top {topN} Fields of Study</h3>
      <BarChartSvg {data} {topN} groupBy="fieldOfStudy" {width} />
    </div>
  </VisWrapper>
</main>

<style>
  h3 {
    margin-left: 30px;
    color: #666;
  }
</style>
