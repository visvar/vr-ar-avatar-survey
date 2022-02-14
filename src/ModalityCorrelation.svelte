<script>
  import {} from "svelte";
  import * as d3 from "d3";
  import VisWrapper from "./VisWrapper.svelte";

  export let data;
  export let width;
  export let shown = true;

  const spacingGroup = 30;
  const spacingOption = 20;
  const marginTop = 15;
  const marginLeft = 150;
  const marginBottom = 25;

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
      key: "collaboration",
      options: [
        { name: "Co-located", value: "co-located" },
        { name: "Remote", value: "remote" },
        { name: "Distributed", value: "distributed" },
      ],
    },
    {
      name: "Representation",
      key: "style",
      options: [
        { name: "Realistic", value: "realistic" },
        { name: "Stylized", value: "stylized" },
        { name: "Abstract", value: "abstract" },
        { name: "Mannequin", value: "mannequin" },
      ],
    },
  ];

  // Add y positions to values
  let currentY = marginTop;
  for (const modality of modalities) {
    modality.y = currentY;
    for (const option of modality.options) {
      currentY += spacingOption;
      option.y = currentY;
    }
    currentY += spacingGroup;
  }
  // Map value->y
  const valueYMap = new Map(
    modalities.flatMap((d) => d.options.map((v) => [v.value, v.y]))
  );
  console.log(valueYMap);

  // Compute sets and count them
  const sets = [];
  for (const publication of data) {
    let setOfPub = [];
    for (const modality of modalities) {
      setOfPub = [...setOfPub, ...publication[modality.key]];
    }
    sets.push(setOfPub.sort());
  }
  const groups = d3
    .groups(sets, (d) => d.join(" "))
    .sort((a, b) => b[1].length - a[1].length)
    .map((d) => {
      return { count: d[1].length, values: d[1][0] };
    });

  $: height = currentY + marginBottom;

  $: scaleX = d3
    .scaleLinear()
    .domain([0, groups.length - 1])
    .range([marginLeft + 10, width - 10]);

  $: scaleStroke = d3.scaleLinear().domain([0, groups[0].count]).range([1, 5]);
</script>

<main>
  <VisWrapper title="Modality Correlation" {shown}>
    <div slot="content">
      <svg {width} {height}>
        <!-- Labels and horizontal lines -->
        {#each modalities as modality}
          <text
            x={marginLeft - 10}
            y={modality.y}
            style="font-weight: bold; text-anchor: end; dominant-baseline: middle"
          >
            {modality.name}
          </text>
          {#each modality.options as option}
            <text
              x={marginLeft - 10}
              y={option.y}
              style="text-anchor: end; dominant-baseline: middle"
            >
              {option.name}
            </text>
            <line
              x1={marginLeft}
              y1={option.y}
              x2={width}
              y2={option.y}
              style="stroke: #888"
            />
          {/each}
        {/each}
        <!-- Data points and lines -->
        {#each groups as item, index}
          <line
            x1={scaleX(index)}
            y1={d3.min(item.values.map((d) => valueYMap.get(d)))}
            x2={scaleX(index)}
            y2={d3.max(item.values.map((d) => valueYMap.get(d)))}
            style="stroke: #888; stroke-width: {scaleStroke(item.count)}"
          />
          {#each item.values as value}
            <circle
              cx={scaleX(index)}
              cy={valueYMap.get(value)}
              r={5}
              fill="#444"
            >
              <title>
                {value}
              </title>
            </circle>
          {/each}
          <!-- x axis -->
          <path
            d="M{scaleX(index)} {height - marginBottom} v-10"
            style="stroke: #888"
          />
          <text x={scaleX(index)} y={height - 10}>
            {item.count}
          </text>
        {/each}
        <path
          d="M{scaleX(0)} {height - marginBottom - 10} H{width - 10}"
          style="stroke: #888"
        />
      </svg>
    </div>
  </VisWrapper>
</main>

<style>
  text {
    text-anchor: middle;
  }
</style>
