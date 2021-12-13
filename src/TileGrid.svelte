<script>
    export let data;
    import Tile from "./Tile.svelte";
</script>

<main>
    {#each data as publication, i (publication.title)}
        <!-- <Tile {...publication} /> -->
        <Tile
            title={publication.title}
            year={publication.year}
            authors={publication.authors}
            doi={publication.doi}
        />
    {/each}
</main>

<style>
    main {
        display: grid;
        grid-template-columns: repeat(auto-fill, 280px);
        grid-template-rows: repeat(auto-fill, 280px);
        gap: 6px;
        margin-bottom: 10px;
        padding: 0 6px 16px 0;
    }
</style>
