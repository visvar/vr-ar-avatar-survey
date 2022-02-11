<script>
  import { getImgSrc } from "../lib.js";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";

  export let publication;

  const dispatch = createEventDispatcher();
  function closed() {
    dispatch("closed", {});
  }

  let open = true;
  $: if (!open) {
    closed();
  }

  const imgSrc = getImgSrc(publication.doi);
  const doiUrl = `https://doi.org/${publication.doi}`;
</script>

<div class="Details">
  <Dialog
    bind:open
    fullscreen
    aria-labelledby="default-focus-title"
    aria-describedby="default-focus-content"
  >
    <h1>{publication.title}</h1>
    <Content id="default-focus-content">
      <div class="year">
        <b>{publication.year}.</b>
        {publication.authors.join(", ")}
      </div>
      <div class="doi">
        <a href={doiUrl} target="_blank">DOI: {publication.doi}</a>
        {#each publication.sourcePaper.filter((d) => !d.U.includes("doi.org")) as url}
          <a href={url.U} title={url.U} target="_blank">
            <span class="pubLink material-icons"> article </span>
          </a>
        {/each}
        <a
          href={`https://scholar.google.de/scholar?hl=en&q=${encodeURI(
            publication.title
          )}`}
          target="_blank">Google Scholar</a
        >
      </div>
      <div>
        <img src={imgSrc} alt="Teaser" />
      </div>
      <div class="abstract">
        {publication.abstract}
      </div>
      <p class="bibtex">
        {publication.bibTex}
      </p>
    </Content>
    <Actions>
      <Button defaultAction use={[InitialFocus]} on:click={closed}>
        <Label>Close</Label>
      </Button>
    </Actions>
  </Dialog>
</div>

<style>
  h1 {
    margin: 10px 20px 5px 20px;
  }

  a {
    margin: 0 3px;
  }

  .pubLink {
    transform: translate(0, 5px);
  }

  img {
    max-width: 100%;
    max-height: 400px;
    background: black;
  }

  .abstract {
    font-style: italic;
  }

  .bibtex {
    font-size: 12px;
    font-family: monospace;
    max-height: 200px;
    overflow-y: auto;
  }
</style>
