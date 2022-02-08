<script>
  export let data;

  import Select, { Option } from "@smui/select";
  import Switch from "@smui/switch";
  import Details from "./Details.svelte";
  import { getImgSrc } from "./lib";

  let selected = null;

  let sortBy = "Citations (high-low)";
  let sortingOptions = [
    "Citations (high-low)",
    "Year (new-old)",
    "Year (old-new)",
    "Title (A-Z)",
  ];

  const sort = (data, sortBy) => {
    let comparator;
    if (sortBy === "Title (A-Z)") {
      comparator = (a, b) => (a.title < b.title ? -1 : 1);
    } else if (sortBy === "Year (new-old)") {
      comparator = (a, b) => b.year - a.year;
    } else if (sortBy === "Year (old-new)") {
      comparator = (a, b) => a.year - b.year;
    } else if (sortBy === "Citations (high-low)") {
      comparator = (a, b) => b.citationCount - a.citationCount;
    }
    return [...data].sort(comparator);
  };

  $: sorted = sort(data, sortBy);
</script>

<main>
  <div class="sortingOptions">
    <Select bind:value={sortBy} label="Sort by">
      {#each sortingOptions as option}
        <Option value={option}>
          {option}
        </Option>
      {/each}
    </Select>
  </div>
  {#each sorted as publication, i (publication.title)}
    <div
      class="publication"
      style={`background-image: url("");`}
      on:click={() => (selected = publication)}
    >
      <img src={getImgSrc(publication.doi)} alt="Publication" />
      <div>
        <h2 class="mdc-typography--headline2" style="font-size: 1.2em;">
          {publication.title}
        </h2>
        <p>
          {publication.authors}
        </p>
        <p>
          {publication.year}, {publication.conference}, cited {publication.citationCount}
          times
        </p>
        <p class="abstract">
          {publication.abstract}
        </p>
      </div>
    </div>
  {/each}
  {#if selected !== null}
    <Details
      title={selected.title}
      year={selected.year}
      authors={selected.authors}
      doi={selected.doi}
      abstract={selected.abstract}
      on:closed={() => (selected = null)}
    />
  {/if}
</main>

<style>
  main {
    display: grid;
    grid-template-columns: auto;
    gap: 20px;
    padding: 5px;
  }

  .sortingOptions {
    display: grid;
    justify-items: center;
    align-items: center;
    margin-bottom: 15px;
    padding: 5px;
    /* border: 2px solid var(--accentColor); */
    border-radius: 5px;
  }

  .publication {
    display: grid;
    grid-template-columns: 200px auto;
    gap: 10px;
    cursor: pointer;
  }

  .publication img {
    width: 200px;
    box-shadow: 0 0 7px #aaa;
    border-radius: 2px;
  }

  .publication .abstract {
    width: 100%;
    /* max-height: 4em; */
    display: -moz-box;
    display: -webkit-box;
    line-clamp: 3;
    -moz-line-clamp: 3;
    -webkit-line-clamp: 3;
    box-orient: vertical;
    -moz-box-orient: vertical;
    -webkit-box-orient: vertical;
    font-style: italic;
    overflow: hidden;
  }

  h2 {
    margin: 0;
    text-shadow: 0 0 5px white;
    user-select: none;
  }
</style>
