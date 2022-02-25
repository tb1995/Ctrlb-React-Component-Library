<script>
import Hero_Fullscreen from "./Components/Hero-Fullscreen.svelte";
import HeroHalfscreen from "./Components/Hero-Halfscreen.svelte";
import Info_1 from "./Components/Info-1.svelte";
import GridThreeColumns from "./Components/Product-Grid/Grid-Three-Columns/Grid-Three-Columns.svelte";
import { Tabs, TabList, TabPanel, Tab } from './Components/Tabs/tabs';


	export let name;
</script>

<HeroHalfscreen></HeroHalfscreen>
<GridThreeColumns></GridThreeColumns>
<Tabs>
	<TabList>
		<Tab>one</Tab>
		<Tab>two</Tab>
		<Tab>three</Tab>
	</TabList>

	<TabPanel>
		<h2>First panel</h2>
	</TabPanel>

	<TabPanel>
		<h2>Second panel</h2>
	</TabPanel>

	<TabPanel>
		<h2>Third panel</h2>
	</TabPanel>
</Tabs>


<style>
	
</style>