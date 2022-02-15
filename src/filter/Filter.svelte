<script>
  export let allData;
  export let data;

  import * as d3 from "d3";
  import IconButton from "@smui/icon-button";
  import ItemSelection from "./ItemSelection.svelte";

  const sortByCount = (array, accessor = (d) => d) => {
    return d3
      .groups(array, accessor)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([key]) => key);
  };

  let immersions = sortByCount(allData.flatMap((d) => d.type));
  let selectedImmersions = [...immersions];
  let collaborations = sortByCount(allData.flatMap((d) => d.collaboration));
  let selectedCollaborations = [...collaborations];
  let representations = sortByCount(allData.flatMap((d) => d.style));
  let selectedRepresentations = [...representations];
  let keywords = sortByCount(allData.flatMap((d) => d.keywords));
  let selectedKeywords = [...keywords];
  let technology = sortByCount(allData.flatMap((d) => d.technology));
  let selectedTechnology = [...technology];
  let fieldOfStudy = sortByCount(allData.flatMap((d) => d.fieldOfStudy));
  let selectedFieldOfStudy = [...fieldOfStudy];

  $: if (
    selectedImmersions ||
    selectedCollaborations ||
    selectedRepresentations ||
    selectedKeywords ||
    selectedTechnology ||
    selectedFieldOfStudy
  ) {
    filter();
  }

  /**
   * Updates the data globally depending on current input values
   */
  const filter = () => {
    data = allData.filter((pub) => {
      if (
        // Type
        d3.intersection(pub.type, selectedImmersions).size === 0 ||
        // Collab
        d3.intersection(pub.collaboration, selectedCollaborations).size === 0 ||
        // Representation
        d3.intersection(pub.style, selectedRepresentations).size === 0 ||
        // Has at least one selected keyword
        d3.intersection(pub.keywords, selectedKeywords).size === 0 ||
        // Has at least one selected technology
        d3.intersection(pub.technology, selectedTechnology).size === 0 ||
        // Has at least one selected field of study
        d3.intersection(pub.fieldOfStudy, selectedFieldOfStudy).size === 0
      ) {
        return false;
      }
      return true;
    });
    console.log("filtered", data);
  };
</script>

<main>
  <h1>Filter</h1>

  <div class="filterSection">
    <ItemSelection
      heading="Immersion"
      collapsed={false}
      items={immersions}
      bind:selected={selectedImmersions}
    />
  </div>

  <div class="filterSection">
    <ItemSelection
      heading="Collaboration"
      collapsed={false}
      items={collaborations}
      bind:selected={selectedCollaborations}
    />
  </div>

  <div class="filterSection">
    <ItemSelection
      heading="Representation"
      collapsed={false}
      items={representations}
      bind:selected={selectedRepresentations}
    />
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
</style>
