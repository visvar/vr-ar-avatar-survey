<script>
    export let title;
    export let doi;
    export let isAr;
    export let isMr;
    export let authors;

    const imgSrc = `./img/${doi.replace("/", "_")}.png`;
    const doiUrl = `https://doi.org/${doi}`;

    const firstLetterUpper = (string) =>
        string.slice(0, 1).toUpperCase() + string.slice(1);
    const authorsText = authors
        .map((d) => d.split(" ").map(firstLetterUpper).join(" "))
        .join(", ");
</script>

<div class="Tile">
    <h3>
        {title}
    </h3>
    <div>
        <!-- <img src={imgSrc} alt="teaser" /> -->
    </div>
    <div class="authors">
        {authorsText}
    </div>
    <div class="doi">
        <a href={doiUrl} target="_blank">DOI: {doi}</a>
    </div>
</div>

<style>
    .Tile {
        display: inline-block;
        border: 1px solid grey;
        width: 95%;
        height: 95%;
        padding: 5px;
        border-radius: 5px;
    }
    .Tile img {
        width: 95%;
        height: 95%;
        background: black;
    }
    .Tile .authors,
    .Tile .doi {
        font-size: 0.8em;
    }
</style>
