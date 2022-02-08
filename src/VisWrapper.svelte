<script>
  import IconButton from "@smui/icon-button";

  export let title = "Title";
  export let shown = true;
</script>

<main>
  <div
    class="header"
    on:click={() => {
      shown = !shown;
    }}
  >
    <h1>
      {title}
    </h1>
    <IconButton class="material-icons" title="Indifferent">
      {shown ? "expand_less" : "expand_more"}
    </IconButton>
  </div>
  {#if shown}
    <div class="content">
      <slot />
    </div>
  {/if}
</main>

<style>
  main {
    margin-bottom: 20px;
    box-shadow: 0 0 7px #aaa;
    border-radius: 5px;
  }

  .header {
    display: grid;
    grid-template-columns: auto 50px;
    margin: 3px;
    padding: 3px 4px 2px 4px;
    cursor: pointer;
  }
</style>
