<script>
    export let data;
    import Tile from "./Tile.svelte";
</script>

<main>
    {#each data as publication, i (publication.title)}
        <Tile {...publication} />
    {/each}
</main>

<style>
    main {
        display: grid;
        grid-template-columns: repeat(auto-fill, 280px);
        gap: 5px;
        padding: 5px;
    }
</style>
