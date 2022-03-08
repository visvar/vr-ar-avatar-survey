<script>
  import * as d3 from "d3";
  import VisWrapper from "./VisWrapper.svelte";
  import { getImgSrc } from "./lib";

  export let data;
  export let width;
  export let shown = true;

  const spacingGroup = 30;
  const spacingOption = 20;
  const marginTop = 15;
  const marginLeft = 200;
  const marginBottom = 25;

  let imageHeight = 40;

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
      shown: false,
      options: [
        { name: "Realistic", value: "realistic" },
        { name: "Stylized", value: "stylized" },
        { name: "Abstract", value: "abstract" },
        { name: "Mannequin", value: "mannequin" },
        { name: "Hologram", value: "hologram" },
      ],
    },
    {
      name: "Body Representation",
      key: "bodyRepresentation",
      shown: false,
      options: [
        { name: "Full-body", value: "full-body" },
        { name: "Hand gestures", value: "hand gestures" },
        { name: "Inverse kinematic", value: "inverse kinematic" },
        { name: "Upper body with head", value: "upper body wiht head" },
        { name: "Vibro-tactile feedback", value: "vibro-tactile feedback" },
        { name: "Head only", value: "head only" },
      ],
    },
    {
      name: "Research Topic",
      key: "researchTopics",
      shown: false,
      options: [
        { name: "Awareness", value: "Awareness" },
        { name: "Embodiment", value: "Embodiment" },
        { name: "Presence", value: "Presence" },
        { name: "Human factors", value: "Human factors" },
        { name: "Tracking", value: "Tracking" },
        { name: "Trust", value: "Trust" },
        { name: "Conformity", value: "Gender conformity" },
        {
          name: "Medical Information System",
          value: "Medical Information System",
        },
        { name: "Teleconsultation", value: "Teleconsultation" },
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

    height = currentY + marginBottom + groups[0]?.count * (imageHeight + 2);
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
        setOfPub.push(...newValues);
      }
      sets.push({ setOfPub: setOfPub.sort(), publication });
    }
    console.log("sets", sets);
    groups = d3
      .groups(sets, (d) => d.setOfPub.join(" "))
      .sort((a, b) => b[1].length - a[1].length)
      .map((d) => {
        return {
          count: d[1].length,
          values: d[1][0].setOfPub,
          publications: d[1].map((row) => row.publication),
        };
      });
  }

  $: console.log("groups", groups);

  $: scaleX = d3
    .scalePoint()
    .domain(d3.range(groups.length))
    .range([marginLeft + 10, width - 10])
    .round(true);

  $: imageWidth = scaleX.step();

  $: scaleStroke = d3
    .scaleLinear()
    .domain([1, groups[0]?.count ?? 1])
    .range([1, 4]);
</script>

<main>
  <VisWrapper title="Modality Correlation" {shown}>
    <div slot="content">
      <div bind:clientWidth={width}
        class="toggles"
        style="grid-template-columns: repeat({modalities.length}, auto);"
      >
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
                style="stroke: #ccc"
              />
            {/each}
          {/if}
        {/each}
        <!-- Data points and lines -->
        <g>
          {#each groups as item, index}
            <line
              x1={scaleX(index)}
              y1={d3.min(item.values.map((d) => valueYMap.get(d)))}
              x2={scaleX(index)}
              y2={height - groups[0]?.count * (imageHeight + 2)}
              style="stroke: #888; stroke-width: 1"
            />
            <!-- <text
            x={scaleX(index)}
            y={d3.max(item.values.map((d) => valueYMap.get(d))) + 25}
          >
            {item.count}
            <title>
              This combination occurs {item.count} times
            </title>
          </text> -->
            {#each item.values as value}
              <circle
                cx={scaleX(index)}
                cy={valueYMap.get(value)}
                r={6}
                fill="#444"
              />
            {/each}
          {/each}
        </g>

        <!-- Images below lines-->
        {#each groups as item, index}
          <g
            transform="translate({scaleX(index)}, {height -
              groups[0]?.count * (imageHeight + 2)})"
          >
            {#each item.publications as publication, j}
              <g
                transform="translate({-imageWidth / 2}, {j *
                  (imageHeight + 2)})"
              >
                <image
                  xlink:href={getImgSrc(publication.doi)}
                  height={imageHeight}
                  width={imageWidth}
                />
              </g>
            {/each}
          </g>
        {/each}
      </svg>
    </div>
  </VisWrapper>
</main>

<style>
  .toggles {
    margin: 7px;
    display: grid;
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
