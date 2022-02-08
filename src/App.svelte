<script>
  import "svelte-material-ui/bare.css";
  import "inter-ui/inter.css";
  import { onMount } from "svelte";
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";
  import { firstLetterUpper } from "./lib.js";
  import Filter from "./Filter.svelte";
  import BubbleChart from "./BubbleChart.svelte";
  import ModalityCorrelation from "./ModalityCorrelation.svelte";
  import Publications from "./Publications.svelte";

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
</script>

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
          <IconButton class="material-icons" aria-label="Bookmark this page">
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
            <BubbleChart {data} shown={true} />
            <ModalityCorrelation {data} shown={true} />
          </div>
          <Publications {data} />
        {/if}
      </main>
    </div>
  </div>
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
