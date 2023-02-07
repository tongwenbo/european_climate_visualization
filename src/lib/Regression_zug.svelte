<script>
  // same as regression, just for Zugspitze
  import * as d3 from "d3";
  import { linear_regression } from "./linear_reg.js";
  console.log(d3);

  export let city_name;
  export let data;
  export let show_regression;

  let {slope, offset} = linear_regression(data);
  console.log(data);
  let x_max = d3.max(data, d => d.year);
  console.log(slope,offset);

  const width = 1325;
  const height = 650;
  const margin = {top:40, right:115, bottom:60, left:40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleLinear()
      .domain([1998, 2023])
      .range([0, innerWidth]);
  
  const y = d3.scaleLinear()
      .domain([-2, -6]) // I intentionally used a closer axis to warn the audience the change of it
      .range([0, innerHeight]);

</script>

<svg width={width} height={height} id="mainsvg" class="svgs">
  <g>
    <text     
      x={innerWidth/2 - 80}
      y="20"
      font-size="24px"
      font-weight="750">
        Yearly temperature mean of {city_name}
    </text>
  </g>

  <g transform={`translate(${margin.left + 90}, ${margin.top + 20})`}>
    <text
      text-anchor="end"
      x={margin.left}
      y="-20"
      font-size="18px"
      font-weight="750"
    >
      Temp(°C)
    </text>

    <text
      text-anchor="end"
      x={innerWidth + 10}
      y={innerHeight + 6}
      font-size="18px"
      font-weight="750"
    >
      Year
    </text>

    {#each x.ticks() as tickValue}
      <g transform={`translate(${x(tickValue)},0)`}>
        <line y2={innerHeight} stroke="grey"></line>
        <text text-anchor="middle" dy=".200em" y={innerHeight + 20}>
          {tickValue}
        </text>
      </g>
    {/each}

    {#each y.ticks() as tickValue}
      <g transform={`translate(0, ${y(tickValue)})`}>
        <line x2={innerWidth - 47} stroke="grey"></line>
        <text text-anchor="middle" dx=".200em" x={innerWidth-1200} y=3 >
          {tickValue}
        </text>
      </g>
    {/each}
    
    {#each data as d}
      <circle
        cx={x(d.year)}
        cy={y(d.temp)}
        r=4
        fill="lightblue"
      />
    {/each}

    {#if show_regression}
      <g id="regression">
        <path d="M {x(1999)} {y(-4.2)}  L {x(x_max)} {y(offset + slope * x_max)}"
          fill = "none"
          stroke = "dodgerblue"
        />
      </g>
    {/if}

  </g>
</svg>
