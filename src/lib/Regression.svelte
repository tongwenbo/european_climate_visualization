<script>
  import * as d3 from "d3";
  import {linear_regression} from "./linear_reg";
  console.log(d3);

  export let city_name;
  export let data;
  export let show_regression;
  export let slope;
  export let offset;

  //const {slope, offset} = linear_regression(data); this could not work because i need to pass these 2 variables seperatly
  const x_max = d3.max(data, d => d.year);

  const width = 1325;
  const height = 650;
  const margin = {top:40, right:115, bottom:60, left:40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleLinear()
      .domain([1998, 2023])
      .range([0, innerWidth]);
  
  const y = d3.scaleLinear()
      .domain([13, 7])
      .range([0, innerHeight]);

</script>

<svg width={width} height={height} id="mainsvg" class="svgs">
  <!-- title of this plot -->
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
    <!-- title of y axis -->
    <text
      text-anchor="end"
      x={margin.left}
      y="-20"
      font-size="18px"
      font-weight="750"
    >
      Temp(°C)
    </text>

    <!-- title of y axis -->
    <text
      text-anchor="end"
      x={innerWidth + 10}
      y={innerHeight + 6}
      font-size="18px"
      font-weight="750"
    >
      Year
    </text>

    <!-- x axis -->
    {#each x.ticks() as tickValue}
      <g transform={`translate(${x(tickValue)},0)`}>
        <line y2={innerHeight} stroke="grey"></line>
        <text text-anchor="middle" dy=".200em" y={innerHeight + 20}>
          {tickValue}
        </text>
      </g>
    {/each}

    <!-- y axis -->
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
        fill="orange"
      />
    {/each}

    {#if show_regression}
      <g id="regression">
        <path d="M {x(0)} {y(offset)} L {x(x_max)} {y(offset + slope * x_max)}"
          fill = "none"
          stroke = "dodgerblue"
        />
      </g>
    {/if}

  </g>
</svg>
