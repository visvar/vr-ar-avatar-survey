<script>
  import IconButton from "@smui/icon-button";

  // value is one of show, hide, indifferent
  export let value = "indifferent";
</script>

<main>
  <span class:selected={value === "show"}>
    <IconButton
      class="material-icons"
      title="Show"
      on:click={() => {
        value = "show";
      }}
    >
      visibility
    </IconButton>
  </span>

  <span class:selected={value === "indifferent"}>
    <IconButton
      class="material-icons"
      title="Indifferent"
      on:click={() => {
        value = "indifferent";
      }}
    >
      panorama_fish_eye
    </IconButton>
  </span>

  <span class:selected={value === "hide"}>
    <IconButton
      class="material-icons"
      title="Hide"
      on:click={() => {
        value = "hide";
      }}
    >
      visibility_off
    </IconButton>
  </span>
</main>

<style>
  main {
    border-radius: 5px;
    background: rgba(255, 255, 255, 0.1);
    display: grid;
    grid-template-columns: repeat(3, auto);
    align-items: center;
    justify-items: center;
  }

  span {
    aspect-ratio: 1/1;
    opacity: 0.6;
  }

  .selected {
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    opacity: 1;
  }
</style>
