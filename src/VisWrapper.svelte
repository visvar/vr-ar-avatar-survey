<script>
  import IconButton from "@smui/icon-button";

  export let title = "Title";
  export let shown = true;
</script>

<main>
  <div class="header">
    <IconButton
      class="material-icons"
      title="Indifferent"
      on:click={() => {
        shown = !shown;
      }}
    >
      {shown ? "expand_less" : "expand_more"}
    </IconButton>
    <h1
      on:click={() => {
        shown = !shown;
      }}
    >
      {title}
    </h1>
    {#if shown}
      <slot name="control">
        <span />
      </slot>
    {/if}
  </div>
  {#if shown}
    <div class="content">
      <slot name="content" />
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
    grid-template-columns: 40px auto auto;
    margin: 3px 3px 3px 0;
    padding: 3px 4px 2px 0;
    cursor: pointer;
  }

  h1 {
    user-select: none;
  }
</style>
