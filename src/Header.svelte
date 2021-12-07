<script>
    export let views;
    export let currentView;
</script>

<h1>Header</h1>

<div>
    {#each views as view, i}
        <li>
            {view}
        </li>
    {/each}
</div>
<div>
    {currentView}
</div>
<div>
    <a href="" target="_blank">Paper</a>
</div>

<style>
</style>
