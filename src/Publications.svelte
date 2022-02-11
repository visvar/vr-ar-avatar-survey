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
    "Study participants (high-low)",
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
    } else if (sortBy === "Study participants (high-low)") {
      comparator = (a, b) => (b.noParticipants ?? 0) - (a.noParticipants ?? 0);
    }
    return [...data].sort(comparator);
  };

  $: sorted = sort(data, sortBy);
</script>

<main>
  <div class="sortingOptions">
    <span>{data.length} publications</span>
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
          <b>{publication.year}</b>
          <i>{publication.conference}</i><br />
          {publication.authors[0]} et al.
          <span class="info" title="Cited {publication.citationCount} times">
            {publication.citationCount}
            <span class="material-icons icon"> format_quote </span>
          </span>
          {#if publication.hasStudy}
            <span
              class="info"
              title="Has a user study with {publication.noParticipants} participants"
            >
              {publication.noParticipants}
              <span class="material-icons icon"> group </span>
            </span>
          {/if}
        </p>
        <!-- <p class="abstract">
          {publication.abstract}
        </p> -->
      </div>
    </div>
  {/each}
  {#if selected !== null}
    <Details publication={selected} on:closed={() => (selected = null)} />
  {/if}
</main>

<style>
  main {
    margin-left: 15px;
    display: grid;
    grid-template-columns: auto;
    grid-auto-rows: min-content;
    gap: 15px;
    padding: 5px;
  }

  .sortingOptions {
    display: grid;
    grid-template-columns: auto auto;
    justify-items: center;
    align-items: center;
    margin-bottom: 10px;
    border-radius: 5px;
    font-size: large;
  }

  .publication {
    display: grid;
    grid-template-columns: 190px auto;
    gap: 10px;
    cursor: pointer;
  }

  .publication img {
    margin: 0 auto;
    max-width: 180px;
    max-height: 180px;
    box-shadow: 0 0 7px #aaa;
    border-radius: 2px;
  }

  .info {
    padding: 1px 2px 1px 4px;
    background: #eee;
    border: 1px solid #ddd;
    border-radius: 5px;
  }

  .icon {
    transform: translate(0, 6px);
    color: #666;
  }

  /* .publication .abstract {
    width: 100%;
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
  } */

  h2 {
    margin: 0;
    text-shadow: 0 0 5px white;
    user-select: none;
  }

  p {
    margin: 8px 0;
  }
</style>
