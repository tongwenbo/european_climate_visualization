<script>
    import * as d3 from "d3";
    import { each } from "svelte/internal";
    import Legend from "./Legend.svelte";

    export let data;
    export let germany;
    $: filtered_data = data.filter((d) => d.Year == 2021 && d["Station country"] == "DEU");
    //$: filtered_eu = europe.filter((d) => d.properties.ISO2 == "DE");

    let absolute_max = d3.max(data, (d) => Math.abs(d["Temperature mean"]));
    let color = d3
        .scaleDiverging((t) => d3.interpolateRdBu(1 - t)) // swap from red->blue to blue->red
        .domain([
            -absolute_max, 
            0, 
            absolute_max
        ]);

    let height = 800;
    let width = 1500;
    const margin = { top: 10, bottom: 80, left: 10, right: 10 };

    $: geoProjection = d3.geoMercator().fitExtent(
        [
            [margin.left, margin.top],
            [width - margin.right, height - margin.bottom],
        ],
        germany //.features[14] when starting with a zoomed in germany (feature[14] contains the germany boundaries)
    );

    $: path = d3.geoPath(geoProjection);
    const zoom = d3
        .zoom()
        .scaleExtent([1/2, 8])
        // @ts-ignore
        .on("zoom", zoomed);

    let transform = { x: 0, y: 0, k: 1 };
    function zoomed(event) {
        transform = event.transform;
    }

    let svg;
    let map_g;
    $: { // "$:"" makes an expression reactive to changes of variables inside the expression, use {} to use multiple expressions 
        if (map_g) {
            d3.select(svg).call(zoom);
        }
    }
</script>

<svg 
    {width} 
    {height} 
    bind:this={svg}>
    <rect 
        {width} 
        {height} 
        fill="#8ab4f8" />
    <g 
        id="map" 
        bind:this={map_g} 
        transform="translate({transform.x}, {transform.y}) scale({transform.k})">
        {#each germany.features as ge}
            <path 
                id="land" 
                d={path(ge)} 
                fill="#a8dab5" 
                stroke="#8db697" 
                stroke-width={0.5 / transform.k} 
                stroke-linejoin="round"
                on:mouseover={function(){
                    d3.select(this)
                    .attr('opacity', 0.5)
                    .attr('stroke', 'black')
                    .attr('stroke-width', 4)
                }}
                on:mouseout={function(){
                    d3.select(this)
                    .attr('opacity', 1)
                    .attr('stroke', '#8db697')
                    .attr('stroke-width', 1)
                }}
            />
        {/each}
        <g 
            id="data" 
            font-size={15 / transform.k} 
            text-anchor="middle">
            {#each filtered_data as point}
                {@const pos = geoProjection([point.Longitude, point.Latitude])}
                <circle 
                    cx={pos[0]} 
                    cy={pos[1]} 
                    r={4 / transform.k} 
                    fill={color(point["Temperature mean"])} 
                    stroke="none">
                    <title>
                        {point["Station city"]}: {point["Temperature mean"]}°C
                    </title>
                </circle>
                {#if transform.k > 0}
                    <text 
                        x={pos[0]} 
                        y={pos[1] - 8 / transform.k}>
                        {point["Station city"]}
                    </text>
                    <text 
                        x={pos[0]} 
                        y={pos[1] + 8 / transform.k} 
                        dominant-baseline="hanging">
                        {#if point["Station city"] == "Helgoland"}
                            (est.){point["Temperature mean"]}°C
                        {:else}
                            {point["Temperature mean"]}°C
                        {/if}
                    </text>
                {/if}
            {/each}
        </g>
    </g>
</svg>
<div id="legend">
    Temperature in 2021 in °C
    <Legend {color} />
</div>

<style>
    #legend {
        background-color: #fff5;
        padding: 0.5em;
        height: 4.5em;
        border-radius: 0.5em;
        backdrop-filter: blur(4px);
        position: absolute;
        bottom: 1em;
        right: 1em;
        width: 320px;
        display: flex;
        flex-direction: column;
        gap: 0.5em;
    }
</style>
