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

  let modalities = [
    {
      name: "Communication",
      key: "socialInteraction",
      shown: true,
      options: [
        { name: "Facial expression", value: "facial expression" },
        { name: "Eye gaze", value: "eye gaze" },
        { name: "Body movement", value: "body movement" },
        { name: "Voice", value: "voice" },
        { name: "Point cloud", value: "point cloud" },
      ],
    },
    {
      name: "Collaboration",
      key: "collaboration",
      shown: true,
      options: [
        { name: "Co-located", value: "co-located" },
        { name: "Remote", value: "remote" },
        { name: "Distributed", value: "distributed" },
      ],
    },
    {
      name: "Immersion",
      key: "type",
      shown: true,
      options: [
        { name: "VR", value: "VR" },
        { name: "AR", value: "AR" },
      ],
    },
    {
      name: "Representation",
      key: "style",
      shown: true,
      options: [
        { name: "Realistic", value: "realistic" },
        { name: "Stylized", value: "stylized" },
        { name: "Abstract", value: "abstract" },
        { name: "Mannequin", value: "mannequin" },
        { name: "Hologram", value: "hologram" },
      ],
    },
  ];

  // Add y positions to values
  let valueYMap;
  let height;
  $: {
    let currentY = marginTop;
    for (const modality of modalities) {
      if (!modality.shown) {
        continue;
      }
      modality.y = currentY;
      for (const option of modality.options) {
        currentY += spacingOption;
        option.y = currentY;
      }
      currentY += spacingGroup;
    }
    // Map value->y
    valueYMap = new Map(
      modalities.flatMap((d) => d.options.map((v) => [v.value, v.y]))
    );
    height = currentY + marginBottom;
  }

  let groups;
  // Compute sets and count them
  $: {
    const sets = [];
    for (const publication of data) {
      let setOfPub = [];
      for (const modality of modalities) {
        if (!modality.shown) {
          continue;
        }
        // Remove those that are not specified in modalities
        const values = publication[modality.key];
        const allowedValues = modality.options.map((d) => d.value);
        const newValues = values.filter((d) => allowedValues.includes(d));
        setOfPub = [...setOfPub, ...newValues];
      }
      sets.push(setOfPub.sort());
    }
    groups = d3
      .groups(sets, (d) => d.join(" "))
      .sort((a, b) => b[1].length - a[1].length)
      .map((d) => {
        return { count: d[1].length, values: d[1][0] };
      });
  }

  $: scaleX = d3
    .scaleLinear()
    .domain([0, groups.length - 1])
    .range([marginLeft + 10, width - 10]);

  $: scaleStroke = d3
    .scaleLinear()
    .domain([0, groups[0]?.count ?? 1])
    .range([0, 4]);
</script>

<main>
  <VisWrapper title="Modality Correlation" {shown}>
    <div slot="content">
      <div class="toggles">
        {#each modalities as { name, shown }}
          <button
            class:shown
            on:click={() => {
              for (const m of modalities) {
                if (m.name === name) {
                  m.shown = !m.shown;
                }
              }
              modalities = [...modalities];
            }}
          >
            {name}
          </button>
        {/each}
      </div>
      <svg {width} {height}>
        <!-- Labels and horizontal lines -->
        {#each modalities as modality}
          {#if modality.shown}
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
          {/if}
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
          <text
            x={scaleX(index)}
            y={d3.max(item.values.map((d) => valueYMap.get(d))) + 25}
          >
            {item.count}
            <title>
              This combination occurs {item.count} times
            </title>
          </text>
          {#each item.values as value}
            <circle
              cx={scaleX(index)}
              cy={valueYMap.get(value)}
              r={5}
              fill="#444"
            />
          {/each}
        {/each}
      </svg>
    </div>
  </VisWrapper>
</main>

<style>
  .toggles {
    margin: 7px;
    display: grid;
    grid-template-columns: repeat(4, auto);
    gap: 8px;
  }

  .toggles button {
    background: none;
    border: none;
    border-bottom: 3px solid #ccc;
    cursor: pointer;
    transition: all 350ms;
  }

  .toggles button.shown {
    border-color: var(--accentColor);
  }

  svg text {
    stroke: white;
    stroke-width: 5;
    paint-order: stroke;
    transition: all 350ms;
    text-anchor: middle;
    user-select: none;
  }
</style>
