<script>
  export let title;
  export let year;
  export let authors;
  export let doi;
  export let abstract;

  import { firstLetterUpper, getImgSrc } from "./lib.js";
  import Dialog, { Title, Content, Actions, InitialFocus } from "@smui/dialog";
  import Button, { Label } from "@smui/button";
  import { createEventDispatcher } from "svelte";

  const dispatch = createEventDispatcher();
  function closed() {
    dispatch("closed", {});
  }

  let open = true;
  $: if (!open) {
    closed();
  }

  const imgSrc = getImgSrc(doi);
  const doiUrl = `https://doi.org/${doi}`;

  const authorsText = authors
    .map((d) => d.split(" ").map(firstLetterUpper).join(" "))
    .join(", ");
</script>

<div class="Details">
  <Dialog
    bind:open
    aria-labelledby="default-focus-title"
    aria-describedby="default-focus-content"
  >
    <Title id="default-focus-title">{title}</Title>
    <Content id="default-focus-content">
      <div class="year">
        {year}
      </div>
      <div>
        <!-- <img src={imgSrc} alt="teaser" /> -->
      </div>
      <div class="authors">
        {authorsText}
      </div>
      <div class="doi">
        <a href={doiUrl} target="_blank">DOI: {doi}</a>
      </div>
      <div>
        <img src={imgSrc} alt="Teaser" />
      </div>
      <div class="abstract">
        {abstract}
      </div>
    </Content>
    <Actions>
      <Button defaultAction use={[InitialFocus]} on:click={closed}>
        <Label>Close</Label>
      </Button>
    </Actions>
  </Dialog>
</div>

<style>
  img {
    width: 100%;
    background: black;
  }

  .abstract {
    font-style: italic;
  }
</style>
