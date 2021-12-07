<script>
    export let data;

    import Slider from "@smui/slider";
    import Button from "@smui/button";
    import Checkbox from "@smui/checkbox";
    import FormField from "@smui/form-field";
    import * as d3 from "d3";

    const yearRange = d3.extent(data, (d) => d.year);
    export let minYear = yearRange[0];
    export let maxYear = yearRange[1];

    const count = (data, accessor, sortBy = "none") => {
        const result = d3.groups(data, accessor).map(([key, d]) => {
            return { key, count: d.length };
        });
        if (sortBy === "countDesc") {
            result.sort((a, b) => b.count - a.count);
        } else if (sortBy === "countInc") {
            result.sort((a, b) => a.count - b.count);
        }
        return result;
    };

    const venues = count(data, (d) => d.conference, "countDesc");
    let options = venues.map((d) => {
        return {
            name: d.key,
            disabled: false,
        };
    });
    export let selectedVenues = options.map((d) => d.name);
</script>

<!--
@component
Here's some documentation for this component.
It will show up on hover.

- You can use markdown here.
- You can also use code blocks here.
- Usage:
  ```tsx
  <main name="exampleName">
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

    <div>
        {#each options as option}
            <FormField>
                <Checkbox
                    bind:group={selectedVenues}
                    value={option.name}
                    disabled={option.disabled}
                />
                <span slot="label"
                    >{option.name}{option.disabled ? " (disabled)" : ""}</span
                >
            </FormField>
        {/each}
    </div>

    <div style="margin-top: 1em;">
        <Button
            on:click={() => {
                selectedVenues = options.map((d) => d.name);
            }}
        >
            All venues
        </Button>
    </div>

    <h2>Modality</h2>
    <div>...</div>

    <h2>Participant count</h2>
    <div>...</div>

    <h2>Research fields</h2>
    <div>...</div>
</main>

<style>
    main {
        padding-left: 5px;
    }
</style>
