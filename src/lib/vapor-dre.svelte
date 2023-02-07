<script>
  // same as vapor, just for greifswald
  import * as d3 from "d3";
  console.log(d3);

  export let data;
  $: filtered_data = data.filter((d) => d["Station city"] == "Greifswald");

  const width = 1325;
  const height = 650;
  const margin = {top:40, right:115, bottom:60, left:40};
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  const x = d3.scaleLinear()
      .domain([1998, 2023])
      .range([0, innerWidth]);
  
  const y = d3.scaleLinear()
      .domain([11, 9])
      .range([0, innerHeight]);

</script>

<svg width={width} height={height} id="mainsvg" class="svgs">
  <g>
    <text     
      x={innerWidth/2 - 80}
      y="20"
      font-size="24px"
      font-weight="750">
        Yearly vapor pressure mean of Greifswald
    </text>
  </g>

  <g transform={`translate(${margin.left + 90}, ${margin.top + 20})`}>
    <text
      text-anchor="end"
      x={margin.left+30}
      y="-20"
      font-size="18px"
      font-weight="750"
    >
      Vapor pressure (hPa)
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
    
    {#each filtered_data as d}
      <circle
        cx={x(d["Year"])}
        cy={y(d["Vapor pressure (hPa)"])}
        r=4
        fill="orange"
      />
    {/each}

  </g>
</svg>
