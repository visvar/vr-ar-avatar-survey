<script>
    export let data;

    import * as d3 from "d3";
    import { BubbleChart } from "./BubbleChart.js";

    const fields = d3
        .groups(
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

    const fieldGroups = new Map([
        ["avatar", "representation"],
        ["gesture", "communication"],
        ["facial expression", "communication"],
        ["robot", "representation"],
    ]);

    const svg = BubbleChart(fields, {
        // label: (d) => d.key,
        label: (d) => `${d.key}\n${d.count}`,
        value: (d) => d.count,
        group: (d) => fieldGroups.get(d.key),
        title: (d) => `${d.key}\n(${d.count} times)`,
        link: (d) => null,
        width: window.innerWidth - 330,
        colors: d3.schemeTableau10,
        fillOpacity: 0.5,
    });

    const showVis = () => {
        const container = document.querySelectorAll("#visualization")[0];
        container.appendChild(svg);
    };
</script>

<main>
    <div id="visualization" on:load={showVis()} />
</main>
