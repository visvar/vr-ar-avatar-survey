<script>
  export let data;

  import IconButton from "@smui/icon-button";
  import VisibilityToggle from "./VisibilityToggle.svelte";
  import ItemSelection from "./ItemSelection.svelte";

  let augmReality = "indifferent";
  let virtReality = "indifferent";

  let colocated = "indifferent";
  let distributed = "indifferent";
  let remote = "indifferent";

  let realistic = "indifferent";
  let stylized = "indifferent";
  let cartoon = "indifferent";

  const lorem = (n) =>
    Array.from({ length: n })
      .fill()
      .map((d, i) => `lorem ${i}`);

  let keywords = lorem(6);
  let selectedKeywords = [...keywords];
  let technology = lorem(8);
  let selectedTechnology = [...technology];
  let fieldOfStudy = lorem(5);
  let selectedFieldOfStudy = [...fieldOfStudy];
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```tsx
  <main name="exampleName">
  ```
-->
<main>
  <h1>Filter</h1>

  <div class="howto">
    <div class="howtogrid">
      <IconButton class="material-icons">visibility</IconButton>
      <span> <b>Want:</b> Show me! </span>
      <IconButton class="material-icons">panorama_fish_eye</IconButton>
      <span> <b>Indifferent:</b> I don't care. </span>
      <IconButton class="material-icons">visibility_off</IconButton>
      <span> <b>Hide:</b> I'm not interested. </span>
    </div>
  </div>

  <div class="filterSection">
    <h2>Immersion</h2>
    <div class="grid">
      <span> augmented reality </span>
      <VisibilityToggle bind:value={augmReality} />
      <span> virtual reality </span>
      <VisibilityToggle bind:value={virtReality} />
    </div>
  </div>

  <div class="filterSection">
    <h2>Collaboration Type</h2>
    <div class="grid">
      <span> Co-located </span>
      <VisibilityToggle bind:value={colocated} />
      <span> Distributed </span>
      <VisibilityToggle bind:value={distributed} />
      <span> Remote </span>
      <VisibilityToggle bind:value={remote} />
    </div>
  </div>

  <div class="filterSection">
    <h2>Representation</h2>
    <div class="grid">
      <span> Realistic </span>
      <VisibilityToggle bind:value={realistic} />
      <span> Stylized </span>
      <VisibilityToggle bind:value={stylized} />
      <span> Cartoon </span>
      <VisibilityToggle bind:value={cartoon} />
    </div>
  </div>

  <div class="filterSection">
    <h2>Social Interaction</h2>
  </div>

  <div class="filterSection">
    <h2>Keywords</h2>
    <ItemSelection items={keywords} bind:selected={selectedKeywords} />
  </div>

  <div class="filterSection">
    <h2>Technology</h2>
    <ItemSelection items={technology} bind:selected={selectedTechnology} />
  </div>

  <div class="filterSection">
    <h2>Field of Study</h2>
    <ItemSelection items={fieldOfStudy} bind:selected={selectedFieldOfStudy} />
  </div>
</main>

<style>
  main {
    height: max-content;
    font-size: 1.1em;
    margin: 0 5px;
    padding: 5px 10px;
    /* border: 2px solid var(--accentColor); */
    border-radius: 5px;
  }

  .howto .howtogrid {
    display: grid;
    grid-template-columns: max-content auto;
    align-items: center;
  }

  .filterSection {
    margin: 10px 0;
    padding: 5px;
    background: var(--accentColor);
    color: #eee;
    border-radius: 5px;
  }

  .filterSection .grid {
    display: grid;
    grid-template-columns: auto 150px;
    align-items: center;
    gap: 5px;
  }
</style>
