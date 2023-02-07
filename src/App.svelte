<script>
    export const name = "Wenbo Tong";
    export const assignment_number = "2";

    import data from "./assets/data.json";
    import germany from "./assets/germany.json";
    import Map from "./lib/Map.svelte";

    import Tl from "./lib/time-location.svelte";

    import Vap from "./lib/vapor.svelte";
    import Vap_dre from "./lib/vapor-dre.svelte";
    import Reg from "./lib/Regression.svelte";
    import Reg_zug from "./lib/Regression_zug.svelte";
    import city_data from "./assets/city_data.json";

    import {linear_slope} from "./lib/linear_slope";
    import {linear_offset} from "./lib/linear_offset";

    let cities = [
      {id:0, text:'Stuttgart'},
      {id:1, text:'Essen'},
      {id:2, text:'Munich'},
      {id:3, text:'Zugspitze'},
      {id:4, text:'Berlin'},
      {id:5, text:'Helgoland'},
      {id:6, text:'Hamburg'},
      {id:7, text:'Greifswald'},
      {id:8, text:'Frankfurt'},
      {id:9, text:'Dresden'},
    ];

    let selected;
    let show_regression = false;
</script>

<Map {data} {germany} />

<!--checkbox for regression-->
<label>
    <input type="checkbox" bind:checked={show_regression}>
    Show regression
</label>
<br>

<!--optionbox for city selection-->
<form on:submit>
    <label for="city">City</label>
    <select bind:value={selected}>
        <option value="N">
            please select a city
        </option>
        {#each cities as city}
            <option value={city}>
                {city.text}
            </option>
        {/each}
    </select>
</form>

{#if selected && selected.id == 3}  <!-- This is for Zugspitze -->
    <Reg_zug city_name={cities[selected.id].text} data={city_data[selected.id]} {show_regression}/>
    <Vap data={data} />
{/if}
{#if selected && selected.id == 7}  <!-- This is for Greifswald -->
    <Reg city_name={cities[selected.id].text} data={city_data[selected.id]} {show_regression} slope={linear_slope(city_data[selected.id])} offset={linear_offset(city_data[selected.id])} />
    <Vap_dre data={data} />
{/if}
{#if selected && selected.id !== 3 && selected.id !== 7}
    <Reg city_name={cities[selected.id].text} data={city_data[selected.id]} {show_regression} slope={linear_slope(city_data[selected.id])} offset={linear_offset(city_data[selected.id])} />
{/if}

<Tl />
