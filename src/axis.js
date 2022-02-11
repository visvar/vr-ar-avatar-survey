import * as d3 from "d3"

/**
 * Allows to use d3 axis with SVG elements defined by svelte
 *
 * @param {*} node
 * @param {*} param1
 * @returns
 *
 * @example
 *  <g
 *    transform="translate(0, {height - margin.bottom})"
 *    use:axis={{
 *      axis: d3.axisBottom,
 *      scale: x,
 *      ticks: 2,
 *      tickFormat: (d) => d.toString(),
 *    }}
 *  />
 */
export default function axis (node, { axis, scale, ticks, tickFormat }) {
  const g = d3.select(node)
  function drawAxis ({ axis, scale, ticks, tickFormat }) {
    g.call(axis(scale).ticks(ticks).tickFormat(tickFormat))
  }
  drawAxis({ axis, scale, ticks, tickFormat })
  return {
    update: drawAxis,
  }
}
