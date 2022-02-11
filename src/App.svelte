<script>
  import "svelte-material-ui/bare.css";
  import "inter-ui/inter.css";
  import { onMount } from "svelte";
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";
  import { firstLetterUpper } from "./lib.js";
  import Filter from "./Filter.svelte";
  import BubbleChartAlt from "./BubbleChartAlt.svelte";
  import ModalityCorrelation from "./ModalityCorrelation.svelte";
  import Publications from "./Publications.svelte";
  import LineChart from "./LineChart.svelte";
  import LineChartAlt from "./LineChartAlt.svelte";
  import RankChart from "./RankChart.svelte";
  import BarChart from "./BarChart.svelte";
  import ForceChart from "./ForceChart.svelte";
  import DRChart from "./DRChart.svelte";
  import Help from "./modals/Help.svelte";
  import About from "./modals/About.svelte";

  let windowWidth;
  let showHelp;
  let showAbout;

  $: publicationWidth = Math.max(windowWidth * 0.4, 600);
  // $: console.log("window w", windowWidth);
  // $: console.log("pub w", publicationWidth);
  $: visWidth = Math.max(600, windowWidth - 360 - publicationWidth);
  // $: visWidth = windowWidth - 360 - publicationWidth;
  $: console.log("visWidth", visWidth);

  // Data loading
  let loading = false;
  let allData = null;
  let data = null;
  const loadData = async () => {
    loading = true;
    const response = await fetch("./data.json");
    data = await response.json();
    data = preprocess(data);
    allData = data;
    if (response.ok) {
      loading = false;
    } else {
      throw new Error(text);
    }
  };
  onMount(loadData);

  /**
   * Preprocesses data to make it more beatufil or uniform, should be done on
   * the JSOn file in the future to only have to do it once.
   *
   * @param data
   */
  const preprocess = (data) => {
    for (const publication of data) {
      publication.authors = publication.authors.map((d) =>
        d.split(" ").map(firstLetterUpper).join(" ")
      );
      publication.technology = publication.technology.map((d) =>
        d.toLowerCase()
      );
    }
    return data;
  };
  loadData();
</script>

<svelte:window bind:innerWidth={windowWidth} />

<div class="flexy">
  <div
    class="top-app-bar-container flexor"
    style={`height:${window.innerHeight}px`}
  >
    <TopAppBar variant="static" prominent={false} dense={true} color="primary">
      <Row>
        <Section>
          <Title>
            Structured Literature Survey for Avatars in Collaborative Augmented
            and Virtual Reality
          </Title>
        </Section>
        <Section align="end" toolbar>
          <IconButton
            class="material-icons"
            on:click={() => {
              showHelp = true;
            }}
          >
            help
          </IconButton>
          <IconButton
            class="material-icons"
            on:click={() => {
              showAbout = true;
            }}
          >
            info
          </IconButton>
        </Section>
      </Row>
    </TopAppBar>
    <div class="flexor-content">
      <main>
        {#if loading === true}
          Loading...
        {:else if data !== null}
          <Filter {allData} bind:data />
          <div class="visualizationContainer">
            <BubbleChartAlt {data} width={visWidth} shown={true} />
            <DRChart {data} width={visWidth} shown={false} />
            <ForceChart {data} width={visWidth} shown={false} />
            <BarChart {data} width={visWidth} shown={true} />
            <ModalityCorrelation {data} width={visWidth} shown={true} />
            <!-- <RankChart {data} width={visWidth} shown={true} /> -->
            <LineChart {data} width={visWidth} shown={true} />
            <LineChartAlt {data} width={visWidth} shown={true} />
          </div>
          <Publications {data} />
        {/if}
      </main>
    </div>
  </div>
  <Help bind:open={showHelp} />
  <About bind:open={showAbout} />
</div>

<style>
  .top-app-bar-container {
    width: 100%;
    margin: 0 0 0 0;
    overflow: auto;
    display: inline-block;
    background-color: var(--mdc-theme-background, #fff);
  }

  @media (max-width: 480px) {
    .top-app-bar-container {
      margin-right: 0;
    }
  }

  .flexy {
    display: flex;
    flex-wrap: wrap;
  }

  .flexor {
    display: inline-flex;
    flex-direction: column;
  }

  .flexor-content {
    flex-basis: 0;
    flex-grow: 1;
    overflow: auto;
    margin-top: 10px;
    margin-bottom: 10px;
  }

  main {
    display: grid;
    grid-template-columns: 360px auto minmax(600px, 40%);
  }
</style>
