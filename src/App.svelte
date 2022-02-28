<script>
import Hero_Fullscreen from "./Components/Hero-Fullscreen.svelte";
import HeroHalfscreen from "./Components/Hero-Halfscreen.svelte";
import HeroFullscreen from "./Components/Hero-Fullscreen.svelte";
import Library from "./Library.svelte";
import { Router, Route, Link } from "svelte-navigator";
import {masterComponentArray} from "./data.js"
import Info_1 from "./Components/Info-1.svelte";
import ResponsiveGrid from "./Components/Product-Grid/Responsive-Grid.svelte";
import Tab from "./Components/Tabs-Spaced/Tab.svelte";
import Navbar from "./Components/Navbar-Traditional.svelte/navbar.svelte";



const tabChange = (e) => {
		activeItem = e.detail;
	}


</script>

<!-- <ResponsiveGrid
		array = {array}
		numberOfColumns = {7}
		objWidth={"200px"}
		gridWidth={"100%"}
	/> -->
<Library />

<Router>

	<main>
	<!-- {#each masterComponentArray as category}
	let List = category.list
		{#each List as component}
		<Route path="{component.url}">

		</Route>
		{/each}

	{/each} -->
    
    <Route path="/Heroes/Fullscreen">
      <HeroFullscreen />
	</Route>
	
	<Route path="/Heroes/Halfscreen">
      <HeroHalfscreen />
    </Route>

	<Route path="/Info/1">
      <Info_1 />
	</Route>
	
	<Route path="/Grids/Responsive">
	  <ResponsiveGrid 
		array = {masterComponentArray.at(0).list}
		numberOfColumns = {2}
		objWidth={"200px"}
        gridWidth={"100%"}
	  />
	</Route>
	
	<Route path="/Tabs/Centered">
    	<Tab 
			componentArray = {masterComponentArray}
			activeItem = {masterComponentArray.at(0).label}
			on:tabChange={tabChange}
		/>
	</Route>
	
	<Route path="/Navbar/Traditional">
      <Navbar />
	</Route>
	

  </main>


</Router>

<style>
	
</style>