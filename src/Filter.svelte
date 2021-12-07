<script>
    export let data;

    import Slider from "@smui/slider";
    import Button from "@smui/button";
    // import { extent } from "d3";

    // const yearRange = extent(data, (d) => d.year);
    const yearRange = [2010, 2021];
    let minYear = yearRange[0];
    let maxYear = yearRange[1];
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```tsx
  <main name="Arethra">
  ```
-->
<main>
    <h1>Filter</h1>

    <h2>Years</h2>

    <Slider
        range
        bind:start={minYear}
        bind:end={maxYear}
        min={yearRange[0]}
        max={yearRange[1]}
        step={1}
        discrete
        tickMarks
        input$aria-label="Years"
    />

    <div>
        <Button
            on:click={() => {
                minYear = yearRange[0];
                maxYear = yearRange[1];
            }}
        >
            All years
        </Button>
    </div>

    <h2>Venue</h2>
    <h2>Citations</h2>
    <h2>Modality</h2>
</main>

<style>
    main {
        padding-left: 5px;
    }
</style>
