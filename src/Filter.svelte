<script>
  export let allData;
  export let data;

  import * as d3 from "d3";
  import IconButton from "@smui/icon-button";
  import VisibilityToggle from "./VisibilityToggle.svelte";
  import ItemSelection from "./ItemSelection.svelte";
  import { unique } from "./lib.js";

  let augmReality = "indifferent";
  let virtReality = "indifferent";

  let colocated = "indifferent";
  let distributed = "indifferent";
  let remote = "indifferent";

  let realistic = "indifferent";
  let stylized = "indifferent";
  let cartoon = "indifferent";

  const sortByCountAndUnique = (array, accessor = (d) => d) => {
    return unique(
      d3
        .groups(array, accessor)
        .sort((a, b) => b.length - a.length)
        .map(([key]) => key)
    );
  };

  let keywords = sortByCountAndUnique(allData.flatMap((d) => d.keywords));
  let selectedKeywords = [...keywords];
  let technology = sortByCountAndUnique(allData.flatMap((d) => d.technology));
  let selectedTechnology = [...technology];
  let fieldOfStudy = sortByCountAndUnique(
    allData.flatMap((d) => d.fieldOfStudy)
  );
  let selectedFieldOfStudy = [...fieldOfStudy];

  const filterVisibility = (publication, inputState, checker) => {
    if (inputState === "indifferent") {
      return true;
    } else if (inputState === "show") {
      return checker(publication);
    } else if (inputState === "hide") {
      return !checker(publication);
    }
  };

  /**
   * Updates the data globally depending on current input values
   */
  const filter = () => {
    data = allData.filter((publication) => {
      // Filter visibility
      if (
        !filterVisibility(publication, augmReality, (d) =>
          d.type.includes("ar")
        )
      ) {
        return false;
      }
      if (
        !filterVisibility(publication, virtReality, (d) =>
          d.type.includes("vr")
        )
      ) {
        return false;
      }
      // Has at least one selected keyword
      if (d3.intersection(publication.keywords, selectedKeywords).size === 0) {
        return false;
      }
      // Has at least one selected technology
      if (
        d3.intersection(publication.technology, selectedTechnology).size === 0
      ) {
        return false;
      }
      // Has at least one selected field of study
      if (
        d3.intersection(publication.fieldOfStudy, selectedFieldOfStudy).size ===
        0
      ) {
        return false;
      }
      return true;
    });
    console.log("filtered", data);
  };

  // afterUpdate(filter);
  $: if (
    augmReality ||
    virtReality ||
    colocated ||
    distributed ||
    remote ||
    realistic ||
    stylized ||
    cartoon ||
    selectedKeywords ||
    selectedTechnology ||
    selectedFieldOfStudy
  ) {
    filter();
  }
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
    <ItemSelection
      heading="Keywords"
      collapsed
      items={keywords}
      bind:selected={selectedKeywords}
    />
  </div>

  <div class="filterSection">
    <ItemSelection
      heading="Technology"
      collapsed
      items={technology}
      bind:selected={selectedTechnology}
    />
  </div>

  <div class="filterSection">
    <ItemSelection
      heading="Field of Study"
      collapsed
      items={fieldOfStudy}
      bind:selected={selectedFieldOfStudy}
    />
  </div>
</main>

<style>
  main {
    height: max-content;
    font-size: 1.1em;
    padding: 5px 10px;
    border-radius: 5px;
  }

  .howto .howtogrid {
    display: grid;
    grid-template-columns: max-content auto;
    grid-template-rows: repeat(3, 30px);
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
