<script>
import ResponsiveGrid from "./Components/Product-Grid/Responsive-Grid.svelte";
import Tab from "./Components/Tabs-Spaced/Tab.svelte";
import {masterComponentArray} from "./data.js"


	const imgDirectory = "/img/component-images/"
	let activeItem = "Heroes"

	const tabChange = (e) => {
		activeItem = e.detail;
	}

    let componentArray = masterComponentArray

</script>

<Tab 
    componentArray = {componentArray}
	activeItem = {activeItem}
	on:tabChange={tabChange}
/>

{#each componentArray as item}
    

{#if activeItem === item.label}
    <ResponsiveGrid 
        array = {item.list}
		numberOfColumns = {2}
		objWidth={"200px"}
        gridWidth={"100%"}
    />
{/if}
{/each}
<style>

</style>