<script>
    export let title;
    export let year;
    export let authors;
    export let doi;

    const imgSrc = `./img/${doi.replace("/", "_")}.png`;
    const doiUrl = `https://doi.org/${doi}`;

    const firstLetterUpper = (string) =>
        string.slice(0, 1).toUpperCase() + string.slice(1);
    const authorsText = authors
        .map((d) => d.split(" ").map(firstLetterUpper).join(" "))
        .join(", ");
</script>

<div class="Tile">
    <h5>
        {title}
    </h5>
    <div class="year">
        {year}
    </div>
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
        /* border: 1px solid grey; */
        width: 265px;
        height: 265px;
        padding: 5px;
        border-radius: 3.5px;
        box-shadow: 0 0 5px rgba(127, 127, 127, 0.7);
    }
    .Tile h5 {
        margin: 0;
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
