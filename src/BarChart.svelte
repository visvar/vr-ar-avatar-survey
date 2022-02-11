<script>
  import * as d3 from "d3";
  import Select, { Option } from "@smui/select";
  import VisWrapper from "./VisWrapper.svelte";
  import BarChartSvg from "./BarChartSvg.svelte";

  export let data;
  export let shown;
  export let width = 100;

  let topN = 5;
</script>

<main>
  <VisWrapper title="Top Lists" {shown}>
    <div slot="control">
      <Select bind:value={topN} label="top">
        {#each d3.range(3, 11) as option}
          <Option value={option}>
            {option}
          </Option>
        {/each}
      </Select>
    </div>
    <div slot="content">
      <h3>Top {topN} Keywords</h3>
      <BarChartSvg {data} {topN} groupBy="keywords" {width} />
      <h3>Top {topN} Fields of Study</h3>
      <BarChartSvg {data} {topN} groupBy="fieldOfStudy" {width} />
      <h3>Top {topN} Authors</h3>
      <BarChartSvg {data} {topN} groupBy="authors" {width} />
    </div>
  </VisWrapper>
</main>

<style>
  h3 {
    margin-left: 30px;
    color: #666;
  }
</style>
