<script>
  import {} from "svelte";
  import * as d3 from "d3";
  import VisWrapper from "./VisWrapper.svelte";

  export let data;
  export let shown = true;

  const fieldGroups = new Map([
    ["avatar", "representation"],
    ["gesture", "communication"],
    ["facial expression", "communication"],
    ["robot", "representation"],
  ]);

  const modalities = [
    {
      name: "Communication",
      key: "socialInteraction",
      options: [
        { name: "Facial expression", value: "facial expression" },
        { name: "Eye gaze", value: "eye gaze" },
        { name: "Body movement", value: "body movement" },
        { name: "Voice", value: "voice" },
      ],
    },
    {
      name: "Collaboration",
      options: [
        { name: "Co-located" },
        { name: "Remote" },
        { name: "Distributed" },
      ],
    },
    {
      name: "Representation",
      options: [
        { name: "Realistic" },
        { name: "Stylized" },
        { name: "Abstract" },
      ],
    },
  ];

  // Add y positions
  const spacingGroup = 30;
  const spacingOption = 20;
  const marginLeft = 150;
  const marginBottom = 150;

  let currentY = 15;
  for (const modality of modalities) {
    modality.y = currentY;
    for (const option of modality.options) {
      currentY += spacingOption;
      option.y = currentY;
    }
    currentY += spacingGroup;
  }

  const height = currentY + marginBottom;
  // Width of text labels

  const showVis = () => {
    const container = document.querySelector("#modalityCorrelation");
    console.log("drawing modality", container);
    if (!container) {
      return;
    }
    const width = container.getBoundingClientRect().width - 25;

    const scaleX = d3
      .scaleBand()
      .domain([1, 2, 3])
      .range([marginLeft, width - 5]);
    const axisX = d3.axisBottom().scale(scaleX);

    d3.select(container).selectAll("*").remove();

    // Draw
    const svg = d3
      .select(container)
      .append("svg")
      .attr("width", width)
      .attr("height", height);

    svg
      .append("g")
      .attr("transform", `translate(0, ${height - marginBottom})`)
      .call(axisX);

    for (const modality of modalities) {
      svg
        .append("text")
        .attr("x", marginLeft - 10)
        .attr("y", modality.y)
        .style("font-weight", "bold")
        .style("text-anchor", "end")
        .style("dominant-baseline", "middle")
        .text(modality.name);
      for (const option of modality.options) {
        svg
          .append("text")
          .attr("x", marginLeft - 10)
          .attr("y", option.y)
          .style("text-anchor", "end")
          .style("dominant-baseline", "middle")
          .text(option.name);
        svg
          .append("line")
          .attr("x1", marginLeft)
          .attr("y1", option.y)
          .attr("x2", width)
          .attr("y2", option.y)
          .style("stroke", "#888");
      }
    }
  };

  // Work around to update chart when data changes
  $: if (data) {
    showVis();
  }
</script>

<main>
  <VisWrapper title="Modality Correlation" {shown}>
    <div id="modalityCorrelation" on:load={showVis()} />
  </VisWrapper>
</main>
