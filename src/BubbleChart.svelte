<script>
    export let data;

    // import * as d3 from "d3";
    import { groups, schemeTableau10 } from "d3";
    import { children } from "svelte/internal";
    import { BubbleChart } from "./BubbleChart.js";

    const fieldGroups = new Map([
        ["avatar", "representation"],
        ["gesture", "communication"],
        ["facial expression", "communication"],
        ["robot", "representation"],
        ["realistic", "representation style"],
        ["stylized", "representation style"],
        ["computer science", ""],
        ["virtual reality", "immersive experience"],
        ["human computer interaction", "human computer interaction"],
        ["augmented reality", "immersive experience"],
        ["mixed reality", "immersive experience"],
        ["multimedia", ""],
        ["immersion", "immersion"],
        ["gaze", "social communication"],
        ["task", ""],
        ["perception", "immersion"],
        ["context", ""],
        ["embodied cognition", "immersion"],
        ["virtual machine", ""],
        ["usability", ""],
        ["social relation", "social communication"],
        ["artificial intelligence", ""],
        ["motion", ""],
        ["task analysis", ""],
        ["visualization", ""],
        ["cognitive psychology", ""],
        ["optical head mounted display", ""],
        ["psychology", ""],
        ["face", "identification"],
        ["computer vision", ""],
        ["sense of agency", "immersion"],
        ["focus", "persona"],
        ["virtual actor", "repesentation"],
        ["human centered computing", "human computer interaction"],
        ["entertainment", ""],
        ["social cue", "social communication"],
        ["electronic mail", ""],
        ["realism", "representation"],
        ["animation", ""],
        ["computer graphics images", ""],
        ["user engagement", "human computer interaction"],
        ["user experience design", "human computer interaction"],
        ["user interface", "human computer interaction"],
        ["scale", ""],
        ["personality", "persona"],
        ["computer mediated communication", "social communication"],
        ["workspace", ""],
        ["workload", ""],
        ["upper body", "representation style"],
        ["user studies", ""],
        ["applied psychology", ""],
        ["collaborative virtual environment", "collaboration"],
        ["immersive technology", "immersive experience"],
        ["computer mediated reality", "immersive experience"],
        ["teleconference", "collaboration"],
        ["class", ""],
        ["rendering", ""],
        ["host", ""]
    ]);

    const showVis = () => {
        const container = document.querySelectorAll("#visualization")[0];
        if (!container) {
            return;
        }
        let fields = groups(
            data.flatMap((p) => p.fieldOfStudy),
            (d) => d
        )
            .sort((a, b) => b[1].length - a[1].length)
            .map(([key, group]) => {
                return {
                    key,
                    count: group.length,
                };
            })
            .filter((d) => d.count > 1);
        // console.log("rendering bubble chart");
        let svg = BubbleChart(fields, {
            // label: (d) => d.key,
            label: (d) => `${d.key.split(" ").join("\n")}\n(${d.count})`,
            value: (d) => d.count,
            group: (d) => fieldGroups.get(d.key),
            title: (d) => `${d.key}\n(${d.count} times)`,
            link: (d) => null,
            width: Math.min(window.innerWidth - 330, window.innerHeight - 100),
            colors: schemeTableau10,
            fillOpacity: 0.5,
        });
        // console.log("appending bubble chart");
        if (container.children.length > 0) {
            container.removeChild(container.children[0]);
        }
        container.appendChild(svg);
    };

    // Work around to update chart when data changes
    $: if (data) {
        showVis();
    }
</script>

<main>
    <div id="visualization" on:load={showVis()} {data} />
</main>
