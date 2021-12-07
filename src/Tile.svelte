<script>
    export let title;
    export let doi;

    const imgSrc = `./img/${doi}.png`;
    const doiUrl = `https://${doi}`;
</script>

<div class="Tile">
    <h3>
        {title}
    </h3>
    <div>
        <img src={imgSrc} alt="teaser" />
    </div>
    <a href={doiUrl} target="_blank">DOI: {doi}</a>
</div>

<style>
    .Tile {
        border: 1px solid grey;
        width: 280px;
    }
    .Tile img {
        width: 256px;
        height: 256px;
        background: black;
    }
</style>
