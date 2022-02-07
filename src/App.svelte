<script>
  import "svelte-material-ui/bare.css";
  import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
  import IconButton from "@smui/icon-button";
  import Filter from "./Filter.svelte";
  import BubbleChart from "./BubbleChart.svelte";
  import Publications from "./Publications.svelte";

  // View
  let views = ["Tiles", "Bubble", "PCP"];
  let currentView = "Tiles";

  // Filter
  let minYear;
  let maxYear;
  let venues;
  let modalities;
  const updateFilter = () => {
    if (!allData) {
      return;
    }
    const venueSet = new Set(venues);
    data = allData.filter((d) => {
      return (
        d.year >= minYear && d.year <= maxYear && venueSet.has(d.conference)
      );
    });
    console.log(data);
  };
  // Update data when filter variables change
  $: if (minYear || maxYear || venues || modalities) {
    updateFilter();
  }

  // Data loading
  let loading = false;
  let allData = null;
  let data = null;
  const loadData = async () => {
    loading = true;
    const response = await fetch("./data.json");
    data = await response.json();
    allData = data;
    if (response.ok) {
      loading = false;
    } else {
      throw new Error(text);
    }
  };
  loadData();
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
          <Filter
            {data}
            bind:minYear
            bind:maxYear
            bind:selectedVenues={venues}
          />
          <BubbleChart {data} />
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
    grid-template-columns: 360px auto 600px;
  }
</style>
