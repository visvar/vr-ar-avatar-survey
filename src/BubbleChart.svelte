<script>
  import { afterUpdate } from "svelte";
  import { groups, schemeTableau10 } from "d3";
  import { BubbleChart } from "./BubbleChart.js";
  import VisWrapper from "./VisWrapper.svelte";

  export let data;
  export let width;
  export let shown = true;

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

  const showVis = () => {
    const container = document.querySelectorAll("#bubbleChart")[0];
    if (!container) {
      return;
    }
    console.log("draw bubble", data);
    const fieldsOfStudy = data.flatMap((p) => p.fieldOfStudy);
    let fields = groups(fieldsOfStudy, (d) => d)
      .sort((a, b) => b[1].length - a[1].length)
      .map(([key, group]) => {
        return {
          key,
          count: group.length,
        };
      })
      .filter((d) => d.count > 1);

    const w = Math.min(width, window.innerHeight / 2);

    let svg = BubbleChart(fields, {
      // label: (d) => d.key,
      label: (d) => `${d.key.split(" ").join("\n")}\n(${d.count})`,
      value: (d) => d.count,
      group: (d) => fieldGroups.get(d.key),
      title: (d) => `${d.key}\n(${d.count} times)`,
      link: (d) => null,
      width: w,
      colors: schemeTableau10,
      fillOpacity: 0.5,
    });
    if (container.children.length > 0) {
      container.removeChild(container.children[0]);
    }
    container.appendChild(svg);
  };

  // Work around to update chart when data changes
  afterUpdate(showVis);
</script>

<main>
  <VisWrapper title="Bubble Chart" {shown}>
    <div slot="content">
      <div id="bubbleChart" on:load={showVis()} />
    </div>
  </VisWrapper>
</main>
