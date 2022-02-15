<script>
  import IconButton from "@smui/icon-button";

  export let heading = "Heading";
  export let items = [];
  export let selected = [];
  export let collapsed = false;

  const toggleItem = (item) => {
    if (selected.includes(item)) {
      selected = selected.filter((d) => d !== item);
    } else {
      selected = [...selected, item];
    }
  };
</script>

<main>
  <div class="header">
    <IconButton
      class="material-icons"
      title="Show/hide"
      on:click={() => {
        collapsed = !collapsed;
      }}
    >
      {collapsed ? "expand_more" : "expand_less"}
    </IconButton>
    <h2
      on:click={() => {
        collapsed = !collapsed;
      }}
    >
      {heading}
    </h2>
    <span class="selectedCount">
      {selected.length}/{items.length}
    </span>
    <IconButton
      class="material-icons"
      title="Select all"
      disabled={selected.length === items.length}
      on:click={() => {
        selected = [...items];
      }}
    >
      check_circle_outline
    </IconButton>
    <IconButton
      class="material-icons"
      title="Select none"
      disabled={selected.length === 0}
      on:click={() => {
        selected = [];
      }}
    >
      radio_button_unchecked
    </IconButton>
  </div>
  {#if !collapsed}
    <div class="itemContainer">
      {#each items as item}
        <button
          class:selected={selected.includes(item)}
          on:click={() => toggleItem(item)}
        >
          {item}
        </button>
      {/each}
    </div>
  {/if}
</main>

<style>
  .header {
    padding-right: 5px;
    display: grid;
    grid-template-columns: 35px auto auto 35px 35px;
    align-items: center;
  }

  .header h2 {
    cursor: pointer;
  }

  .selectedCount {
    font-size: small;
  }

  .itemContainer {
    max-height: 300px;
    overflow-y: auto;
  }

  button {
    margin: 2.5px;
    padding: 3px 4px 2px 4px;
    border-radius: 5px;
    color: #eee;
    font-size: medium;
    background: none;
    border: 2px solid rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: 300ms;
  }

  .selected {
    border-color: rgba(255, 255, 255, 0.4);
    background: rgba(255, 255, 255, 0.2);
    transition: 300ms;
  }
</style>
