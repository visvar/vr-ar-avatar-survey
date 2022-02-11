<script>
    import * as d3 from "d3";
    import VisWrapper from "./VisWrapper.svelte";
    import { fade } from "svelte/transition";

    export let data;
    export let width;
    export let shown = true;
    const height = width;
    const margin = { left: 1, right: 1, bottom: 1, top: 1 };
    const padding = 3;

    const fieldGroups = new Map([
        ["animation", ""],
        ["applied psychology", ""],
        ["artificial intelligence", ""],
        ["augmented reality", "immersive experience"],
        ["avatar", "representation"],
        ["class", ""],
        ["cognitive psychology", ""],
        ["collaborative virtual environment", "collaboration"],
        ["computer graphics images", ""],
        ["computer mediated communication", "social communication"],
        ["computer mediated reality", "immersive experience"],
        ["computer science", ""],
        ["computer vision", ""],
        ["context", ""],
        ["electronic mail", ""],
        ["embodied cognition", "immersion"],
        ["entertainment", ""],
        ["face", "identification"],
        ["facial expression", "communication"],
        ["focus", "persona"],
        ["gaze", "social communication"],
        ["gesture", "communication"],
        ["host", ""],
        ["human centered computing", "human computer interaction"],
        ["human computer interaction", "human computer interaction"],
        ["immersion", "immersion"],
        ["immersive technology", "immersive experience"],
        ["mixed reality", "immersive experience"],
        ["motion", ""],
        ["multimedia", ""],
        ["optical head mounted display", ""],
        ["perception", "immersion"],
        ["personality", "persona"],
        ["psychology", ""],
        ["realism", "representation"],
        ["realistic", "representation style"],
        ["rendering", ""],
        ["robot", "representation"],
        ["scale", ""],
        ["sense of agency", "immersion"],
        ["social cue", "social communication"],
        ["social relation", "social communication"],
        ["stylized", "representation style"],
        ["task analysis", ""],
        ["task", ""],
        ["teleconference", "collaboration"],
        ["upper body", "representation style"],
        ["usability", ""],
        ["user engagement", "human computer interaction"],
        ["user experience design", "human computer interaction"],
        ["user interface", "human computer interaction"],
        ["user studies", ""],
        ["virtual actor", "repesentation"],
        ["virtual machine", ""],
        ["virtual reality", "immersive experience"],
        ["visualization", ""],
        ["workload", ""],
        ["workspace", ""],
    ]);

    $: fieldsOfStudy = data.flatMap((p) => p.fieldOfStudy);
    $: fields = d3
        .groups(fieldsOfStudy, (d) => d)
        .sort((a, b) => b[1].length - a[1].length)
        .map(([key, group]) => {
            return {
                key,
                count: group.length,
            };
        })
        .filter((d) => d.count > 1);

    const label = (d) => `${d.key.split(" ").join("\n")}\n(${d.count})`;
    const value = (d) => d.count;
    const group = (d) => fieldGroups.get(d.key);
    const title = (d) => `${d.key}\n(${d.count} times)`;

    $: V = d3.map(fields, value);
    $: G = d3.map(fields, group);
    $: L = d3.map(fields, label);
    $: T = d3.map(fields, title);
    $: I = d3.range(V.length).filter((i) => V[i] > 0);

    $: groups = new d3.InternSet(groups);
    $: color = d3.scaleOrdinal(groups, d3.schemeTableau10);

    $: hierarchy = d3.hierarchy({ children: I }).sum((i) => V[i]);
    $: root = d3
        .pack()
        .size([width - margin.left - margin.right, height - margin.top - margin.bottom])
        .padding(padding)(hierarchy);

    $: leaves = root.leaves();

    const uid = `0-${Math.random().toString(16).slice(2)}`;
</script>

<main>
    <VisWrapper title="Bubble Chart" {shown}>
        <div slot="content">
            <svg {width} {height} viewBox="-{margin.left},-{margin.top},{width},{height}" fill="currentColor" font-family="sans-serif" text-anchor="middle">
                {#each leaves as leaf}
                    <g transform="translate({leaf.x}, {leaf.y})" transition:fade={{duration: 350}}>
                        <circle r={leaf.r} fill={color(G[leaf.data])} fill-opacity=0.5 />
                        <title>{T[leaf.data]}</title>
                        <clipPath id="{uid}-clip-{leaf.data}">
                            <circle r={leaf.r}></circle>
                        </clipPath>
                        <text 
                            font-size={leaf.r / 3.5} 
                            clip-path="url({new URL(`#${uid}-clip-${leaf.data}`, location)})">
                            {#each L[leaf.data].split(/\n/g) as d, i}
                                <tspan x="0" y="{i - L[leaf.data].split(/\n/g).length / 2 + 0.85}em" fill-opacity={i == L[leaf.data].length - 1 ? 0.7 : null}>
                                    {d}
                                </tspan>
                            {/each}
                        </text>
                    </g>
                {/each}
            </svg>
        </div>
    </VisWrapper>
</main>

<style>
    svg {
        max-width: 100%;
        height: auto;
    }

    svg g {
        text-decoration: none;
        fill: #111;
        transition: all 350ms;
    }

    circle {
        transition: all 350ms;
    }

    text {
        user-select: none;
        pointer-events: none;
    }
</style>
