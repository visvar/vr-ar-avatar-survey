<script>
  export let data;
  import Details from "./Details.svelte";
  import Card, { Content } from "@smui/card";
  import { getImgSrc } from "./lib";

  let selected = null;
</script>

<main>
  <div class="card-display">
    {#each data as publication, i (publication.title)}
      <div
        class="card-container"
        style={`background-image: url("${getImgSrc(publication.doi)}");`}
        on:click={() => (selected = publication)}
      >
        <Card style="height: 100%; background: none">
          <div style="padding: 1rem;">
            <h2 class="mdc-typography--headline6" style="font-size: 0.8em;">
              {publication.title}
            </h2>
          </div>
        </Card>
      </div>
    {/each}
  </div>
  {#if selected !== null}
    <Details
      title={selected.title}
      year={selected.year}
      authors={selected.authors}
      doi={selected.doi}
      on:closed={() => (selected = null)}
    />
  {/if}
</main>

<style>
  .card-display {
    display: grid;
    grid-template-columns: repeat(auto-fill, 200px);
    gap: 6px;
  }

  .card-container {
    width: 200px;
    height: 200px;
    background-position: center center;
    background-size: cover;
    background-color: #888;
    background-blend-mode: lighten;
    cursor: pointer;
  }

  h2 {
    margin: 0;
    text-shadow: 0 0 5px white;
    user-select: none;
  }
</style>
