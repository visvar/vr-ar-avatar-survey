<script>
  export let allData;
  export let data;

  import * as d3 from "d3";
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

  const sortByCount = (array, accessor = (d) => d) => {
    return d3
      .groups(array, accessor)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([key]) => key);
  };

  let keywords = sortByCount(allData.flatMap((d) => d.keywords));
  let selectedKeywords = [...keywords];
  let technology = sortByCount(allData.flatMap((d) => d.technology));
  let selectedTechnology = [...technology];
  let fieldOfStudy = sortByCount(allData.flatMap((d) => d.fieldOfStudy));
  let selectedFieldOfStudy = [...fieldOfStudy];

  // const filterVisibility = (publication, inputState, checker) => {
  //   if (inputState === "indifferent") {
  //     return true;
  //   } else if (inputState === "show") {
  //     return checker(publication);
  //   } else if (inputState === "hide") {
  //     return !checker(publication);
  //   }
  // };

  /**
   * Filter according to visibility toggles
   * @param {object} publication publication data
   * @param {string} inputState current value of the input element
   * @param {string} key data key
   * @param {string} value dtaa value
   */
  const filterVsb = (publication, inputState, key, value) => {
    if (inputState === "indifferent") {
      return true;
    }
    const hasValue = publication[key].includes(value);

    if (inputState === "show") {
      return hasValue;
    } else if (inputState === "hide") {
      return !hasValue;
    }
  };

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

  /**
   * Updates the data globally depending on current input values
   */
  const filter = () => {
    data = allData.filter((pub) => {
      /**
       * Filter for visibility
       */
      // Type
      if (!filterVsb(pub, augmReality, "type", "ar")) return false;
      if (!filterVsb(pub, virtReality, "type", "vr")) return false;
      // Collab
      if (!filterVsb(pub, colocated, "collaboration", "co-located"))
        return false;
      if (!filterVsb(pub, distributed, "collaboration", "distibuted"))
        return false;
      if (!filterVsb(pub, remote, "collaboration", "remote")) return false;
      // Representation
      if (!filterVsb(pub, realistic, "style", "realistic")) return false;
      if (!filterVsb(pub, stylized, "style", "stylized")) return false;
      if (!filterVsb(pub, cartoon, "style", "cartoon")) return false;
      /**
       * Filter for item selections
       */
      // Has at least one selected keyword
      if (d3.intersection(pub.keywords, selectedKeywords).size === 0) {
        return false;
      }
      // Has at least one selected technology
      if (d3.intersection(pub.technology, selectedTechnology).size === 0) {
        return false;
      }
      // Has at least one selected field of study
      if (d3.intersection(pub.fieldOfStudy, selectedFieldOfStudy).size === 0) {
        return false;
      }
      return true;
    });
    console.log("filtered", data);
  };
</script>

<main>
  <h1>Filter</h1>

  <div class="howto">
    <div class="howtogrid">
      <IconButton class="material-icons">visibility</IconButton>
      <span> <b>Show:</b> Show these. </span>
      <IconButton class="material-icons">panorama_fish_eye</IconButton>
      <span> <b>Indifferent:</b> I don't care. </span>
      <IconButton class="material-icons">visibility_off</IconButton>
      <span> <b>Hide:</b> Don't show these. </span>
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
    padding-left: 5px;
    display: grid;
    grid-template-columns: auto 150px;
    align-items: center;
    gap: 5px;
  }
</style>
