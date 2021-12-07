<script>
    import TopAppBar, { Row, Section, Title } from "@smui/top-app-bar";
    import IconButton from "@smui/icon-button";
    import SegmentedButton, { Segment } from "@smui/segmented-button";
    import { Label } from "@smui/common";

    // import "../node_modules/svelte-material-ui/bare.css";
    import "svelte-material-ui/bare.css";
    //import * as d3 from 'd3';
    import Filter from "./Filter.svelte";
    import TileGrid from "./TileGrid.svelte";

    // View
    let views = ["Tiles", "Bubble", "PCP"];
    let currentView = "Tiles";

    // Filter
    let filterStateDefault = {
        yearRange: [],
    };

    // Data loading
    let loading = false;
    let data = [];
    const loadData = async () => {
        loading = true;
        const response = await fetch("./data.json");
        data = await response.json();

        if (response.ok) {
            loading = false;
        } else {
            throw new Error(text);
        }
    };
    loadData();
</script>

<div class="flexy">
    <div
        class="top-app-bar-container flexor"
        style={`height:${window.innerHeight}px`}
    >
        <TopAppBar
            variant="static"
            prominent={false}
            dense={true}
            color="secondary"
        >
            <Row>
                <Section>
                    <IconButton class="material-icons">menu</IconButton>
                    <Title>VR/AR Avatar Survey</Title>
                </Section>
                <Section align="center" toolbar>
                    <SegmentedButton
                        segments={views}
                        singleSelect
                        let:segment
                        bind:selected={currentView}
                    >
                        <Segment {segment}>
                            <Label>{segment}</Label>
                        </Segment>
                    </SegmentedButton>
                </Section>
                <Section align="end" toolbar>
                    <IconButton class="material-icons" aria-label="Download"
                        >file_download</IconButton
                    >
                    <IconButton
                        class="material-icons"
                        aria-label="Bookmark this page">bookmark</IconButton
                    >
                </Section>
            </Row>
        </TopAppBar>
        <div class="flexor-content">
            <main>
                {#if loading === true}
                    Loading...
                {:else}
                    <Filter />
                    <TileGrid {data} />
                {/if}
            </main>
        </div>
    </div>
</div>

<style>
    .top-app-bar-container {
        /* max-width: 480px; */
        width: 100%;
        /* height: 2000px; */
        /* height: 100%; */
        margin: 0 0 0 0;
        overflow: auto;
        display: inline-block;
        /* border: 1px solid            var(--mdc-theme-text-hint-on-background, rgba(0, 0, 0, 0.1)); */
        background-color: var(--mdc-theme-background, #fff);
        /* background-color: cornflowerblue; */
    }

    @media (max-width: 480px) {
        .top-app-bar-container {
            margin-right: 0;
        }
    }

    .flexy {
        display: flex;
        flex-wrap: wrap;
    }

    .flexor {
        display: inline-flex;
        flex-direction: column;
    }

    .flexor-content {
        flex-basis: 0;
        /* height: 0; */
        /* height: 100%; */
        flex-grow: 1;
        /* flex-grow: 100%; */
        overflow: auto;
    }

    main {
        /* height: 100%; */
        display: grid;
        grid-template-columns: 300px auto;
    }
</style>
