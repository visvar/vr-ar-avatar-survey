<script>
  export let items = [];
  export let selected = [];

  const toggleItem = (item) => {
    if (selected.includes(item)) {
      selected = selected.filter((d) => d !== item);
    } else {
      selected = [...selected, item];
    }
  };
</script>

<main>
  {#each items as item}
    <button
      class:selected={selected.includes(item)}
      on:click={() => toggleItem(item)}
    >
      {item}
    </button>
  {/each}
</main>

<style>
  button {
    margin: 3px;
    padding: 3px 4px 2px 4px;
    border-radius: 5px;
    color: #eee;
    font-size: larger;
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
