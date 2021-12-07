<script>
    export let data;

    import Tile from "./Tile.svelte";
</script>

<main>
    <h1>Content</h1>
    <div class="grid">
        {#each data as publication, i}
            <Tile {...publication} />
        {/each}
    </div>
</main>

<style>
    .grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
    }
</style>
