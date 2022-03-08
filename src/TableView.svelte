<script>
  import * as d3 from "d3";
  import VisWrapper from "./VisWrapper.svelte";
  export let data;
  export let width;

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

  const colorScale = d3.scaleOrdinal(d3.schemeTableau10);

  $: console.log("data table", data);
</script>

<VisWrapper title="Table">
  <div slot="control" />
  <table slot="content">
    <thead>
      <tr>
        <th class="last" />
        {#each modalities as modal, j}
          {#each modal.options as option, i}
            <th
              class:last={j != modalities.length - 1 &&
                i == modal.options.length - 1}
              style="color: {colorScale(modal.key)}"
              class="rotated"
            >
              {option.name}
            </th>
          {/each}
        {/each}
        <!-- <th><span class="material-icons icon"> format_quote </span></th>
        <th><span class="material-icons icon"> group </span></th> -->
      </tr>
    </thead>
    <tbody>
      {#each data as publication}
        <tr>
          <td class="last" style="text-align: right"
            >{publication.authors[0]} et al.</td
          >

          <!-- <td
            >{#if publication.citationCount > 0}
              {publication.citationCount}
            {/if}
          </td>
          <td>
            {#if publication.hasStudy}
              {publication.noParticipants}
            {/if}
          </td> -->
          {#each modalities as modal, j}
            {#each modal.options as option, i}
                <!-- <td style="background-color: {publication[modal.key].includes(option.value) ? colorScale(modal.key) : null}"></td> -->
              <td
                class:last={j != modalities.length - 1 &&
                  i == modal.options.length - 1}                
              >
                {#if publication[modal.key].includes(option.value)}
                <!-- <span style="color: {colorScale(modal.key)}">⬤</span> -->
                <span style="color: {colorScale(modal.key)}; font-weight: 900; text-align: center;">✓</span>
                {/if}
              </td>
            {/each}
          {/each}
        </tr>
      {/each}
      <tr>
        <th />
        {#each modalities as modal}
          <th
            colspan={modal.options.length}
            style="background-color: {colorScale(modal.key)}">{modal.name}</th
          >
        {/each}
      </tr>
    </tbody>
  </table>
</VisWrapper>

<style>
  tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  tbody tr:hover {
      background-color: #f0f0f0;
  }

  td, th {
    padding: 0.333em;
  }

  tr td:first-child {
    padding-left: 1em;
  }
  tr td:last-child {
    padding-right: 1em;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    border-radius: 5px;
  }

  .rotated {
    margin: 0;
    padding: 0;
    text-align: end;
    writing-mode: vertical-lr;
  }

  .last {
    border-right: 1px solid #ddd;
  }
</style>
