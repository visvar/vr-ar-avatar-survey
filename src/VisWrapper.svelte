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
      class="separator"
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
    margin-top: 5px;
    margin-bottom: 20px;
    box-shadow: 0 0 7px #aaa;
    border-radius: 5px;
    overflow: hidden;
  }

  .header {
    display: flex;
    align-items: center;
    gap: 2em;
    margin: 3px 3px 3px 0;
    padding: 3px 4px 2px 0;
    cursor: pointer;
  }

  .separator {
    flex-grow: 1;
  }

  h1 {
    user-select: none;
  }
</style>
