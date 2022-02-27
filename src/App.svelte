<script>
import Hero_Fullscreen from "./Components/Hero-Fullscreen.svelte";
import HeroHalfscreen from "./Components/Hero-Halfscreen.svelte";
import Info_1 from "./Components/Info-1.svelte";
import GridThreeColumns from "./Components/Product-Grid/Grid-Three-Columns/Grid-Three-Columns.svelte";
import { Tabs, TabList, TabPanel, Tab } from './Components/Tabs/tabs';
import ResponsiveGrid from "./Components/Product-Grid/Responsive-Grid.svelte";
import HeroFullscreen from "./Components/Hero-Fullscreen.svelte";


	export let name;
	const imgDirectory = "/img/component-images/"
	export let componentArray = {
		heroes: [
			{
			title: "Hero Fullscreen",
			description: "Hero with 100vh and with a CTA",
			url: "",
			imageUrl: imgDirectory + "hero-fullscreen.jpg",
			dependencies: [],
			listOfProps: []
			}
		],
		grids: [
				{
			title: "Responsive Grid",
			description: "Specify the number of columns and item width via the props",
			url: "",
			imageUrl: imgDirectory + "hero-fullscreen.jpg",
			dependencies: [],
			listOfProps: []
			}
		],
		tabs: [],
		infoSection: [],
		navbars: [],
		footers: [],
		galleries: [],
		forms: []
	}
	export let array = [
    {
        title: "Here is a title",
        imgUrl: "/img/icon.jpg"
    },
    {
        title: "Here is a title",
        imgUrl: "/img/icon.jpg"
    },
    {
        title: "Here is a title",
        imgUrl: "/img/icon.jpg"
    },
    {
        title: "Here is a title",
        imgUrl: "/img/icon.jpg"
    },
    {
        title: "Here is a title",
        imgUrl: "/img/icon.jpg"
	},
	{
        title: "Here is a title",
        imgUrl: "/img/icon.jpg"
    },
    {
        title: "Here is a title",
        imgUrl: "/img/icon.jpg"
    },
    {
        title: "Here is a title",
        imgUrl: "/img/icon.jpg"
    },
]

let fourColumns = 4;
</script>

<HeroFullscreen />
<HeroHalfscreen></HeroHalfscreen>
<ResponsiveGrid
		array = {array}
		numberOfColumns = {7}
		objWidth={"200px"}
		gridWidth={"100%"}
	/>
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