<script>
    import * as d3 from "d3";

    export let color;
    export let width = 320;

    const n = 256;
    const margin = {left: 20, right: 20};

    // Copyright 2021, Observable Inc.
    // Released under the ISC license.
    // https://observablehq.com/@d3/color-legend
    function ramp(color, n = 256) {
        const canvas = document.createElement("canvas");
        canvas.width = n;
        canvas.height = 1;

        const context = canvas.getContext("2d");

        for (let i = 0; i < n; ++i) {
            context.fillStyle = color(i / (n - 1));
            context.fillRect(i, 0, 1, 1);
        }
        return canvas;
    }

    $: m = Math.min(color.domain().length, color.range().length)
    $: x = color.copy().rangeRound(d3.quantize(d3.interpolate(0, width - margin.left - margin.right), m));
    $: legendUrl = ramp(color.copy().domain(d3.quantize(d3.interpolate(0, 1), m)), n).toDataURL();
</script>

<svg {width} height="42">
    <g transform="translate({margin.left}, 0)">
        <image width={width - margin.left - margin.right} height="18" preserveAspectRatio="none" xlink:href={legendUrl} />
        <g id="legend" transform="translate(0, 18)" text-anchor="middle" dominant-baseline="hanging">
            {#each x.ticks(5) as tick}
                <path d="M {x(tick)} 0 v -18" stroke="black" fill="none" />
                <text x={x(tick)} y={3}>{tick}</text>
            {/each}
        </g>
    </g>
</svg>
