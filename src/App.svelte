<script>
import Hero_Fullscreen from "./Components/Hero-Fullscreen.svelte";
import HeroHalfscreen from "./Components/Hero-Halfscreen.svelte";
import HeroFullscreen from "./Components/Hero-Fullscreen.svelte";
import Library from "./Library.svelte";
import { Router, Route, Link } from "svelte-navigator";
import {masterComponentArray, navbarArray, iconList, responsiveListMoreInfoList, responsiveListIconList, fourGrids, images, kncImages} from "./data.js"
import Info_1 from "./Components/Info-1.svelte";
import ResponsiveGrid from "./Components/Product-Grid/Responsive-Grid.svelte";
import Tab from "./Components/Tabs-Spaced/Tab.svelte";
import Navbar from "./Components/Navbar-Traditional.svelte/navbar.svelte";
import Footer_4Columns from "./Components/Footers/Footer-4-columns/Footer-4-Columns.svelte";
import ResponsiveGridMoreInfo from "./Components/Product-Grid/Responsive-Grid-More-Info.svelte";
import Info_1Alt from "./Components/Info-Sections/Info-1-Alt.svelte";
import Info_1Alt_2 from "./Components/Info-Sections/Info-1-Alt-2.svelte";
import ResponsiveGridIcons from "./Components/Product-Grid/Responsive-Grid-Icons.svelte";
import Info_4Grid from "./Components/Info-Sections/Info-4-Grid.svelte";
import OnlyButton from "./Components/Banners/Only-Button.svelte";
import ParagraphButton from "./Components/Banners/Paragraph-Button.svelte";
import Form_1 from "./Components/Forms/Form-1.svelte";
import FullLengthGallery from "./Components/Galleries/Full-Length-Gallery.svelte";
import KnCStyleGallery from "./Components/Galleries/KnC-Style-Gallery.svelte";
import InfoWithForm from "./Components/Info-Sections/Info-With-Form.svelte";
import { createClient } from "contentful"
import createContentfulAPI from "../node_modules/contentful-resolve-response"
import ContentfulEvents from "./Components/Test-Headless-CMS/Contentful-Events.svelte";
import LeftRightSection from "./Components/Info-Sections/Left-Right-Section.svelte";
import HeroTwoColumns from "./Components/Heroes/Hero-Two-Columns.svelte";
import TabBorder from "./Components/Tabs-Spaced-Border/Tab-Border.svelte";
import Slider from "./Components/Galleries/Slider.svelte";


    let componentArray = masterComponentArray


let events = [];

let activeItem = "Heroes"

const tabChange = (e) => {
		activeItem = e.detail;
	}


var client = createClient({
  space: 'voutmqui4m2l',
  accessToken: 'Pch2QB-Irp5JmCIl0DTH_7wCMNWZtNQe5oFsM7CYRo8',
});


const res = client.getEntries({content_type: 'events'}).then(function (event) {
  // logs the entry metadata
//   console.log(event.items);
  events = event.items;
  // logs the field with ID title
});


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
	  <HeroHalfscreen 
		title="CtrlB Component Library"
		subheading="Racking up the components, baby"
		buttonText="I am a Button"
		buttonUrl="#"
	  />
    </Route>

	<Route path="/Info/1">
      <Info_1 />
	</Route>

	<Route path="/Info/1-Alt">
      <Info_1Alt
		infoHeading="So much more than just a cafe"
		tinyTopText="odd little bit of text"
		infoPara="Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following."
		buttonText="About Us"
		buttonUrl="#"
		imgUrl="/img/icon.jpg"
		imgAlt=""
	/>
	</Route>


	<Route path="/Info/1-Alt">
      <Info_1Alt
		infoHeading="So much more than just a cafe"
		tinyTopText="odd little bit of text"
		infoPara="Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following."
		buttonText="About Us"
		buttonUrl="#"
		imgUrl="/img/icon.jpg"
		imgAlt=""
	/>
	</Route>

	<Route path="/Info/1-Reversed">
		<Info_1Alt_2
			infoHeading="So much more than just a cafe"
			tinyTopText="odd little bit of text"
			infoPara="Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following."
			buttonText="About Us"
			buttonUrl="#"
			imgUrl="/img/icon.jpg"
			imgAlt=""
		/>
	</Route>

	<Route path="/Info/Grids">
		<Info_4Grid
		infoHeading="So much more than just a cafe"
		tinyTopText="odd little bit of text"
		infoPara="Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following."
		buttonText="About Us"
		buttonUrl="#"
		fourGrids={fourGrids}
/>

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

	<Route path="/Footers/Column-4">
    <Footer_4Columns 
		linkList1 = {navbarArray}
		linkList2 = {navbarArray}
		footerLogoUrl = "/img/logo.png"
		footerLogoAlt = {""}
		contactList = {iconList}
		footerDescription = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
		CustomerName="Shia Labeouf"
		/>
	</Route>

	<Route path="/Grids/Responsive-Info">
		<ResponsiveGridMoreInfo 
			array = {responsiveListMoreInfoList}
			numberOfColumns = {2}
			objWidth={"200px"}
			gridWidth={"100%"}
		/>
	</Route>

	<Route path="/Grids/Responsive-Info-Icons">
			<ResponsiveGridIcons
				array = {responsiveListIconList}
				numberOfColumns = {3}
				objWidth={"200px"}
				gridWidth={"100%"}
				/>
	</Route>

	<Route path="/Banners/OnlyButton">
		<OnlyButton 
			buttonText = "I am a CTA"
			buttonUrl = "#"
		/>
	</Route>

	<Route path="/Banners/Paragraph-Button">
		<ParagraphButton
		buttonText = "I am a CTA"
		buttonUrl = "#"
		paragraph = "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
/>
	</Route>

	<Route path="/Forms/Form-1"> 
		<Form_1></Form_1>
	</Route>

	<Route path="/Galleries/Basic">
		<FullLengthGallery 
		images = {images}
		numberOfColumns = {4}
		objWidth={"200px"}
		gridWidth={"90%"}
		/>
	</Route>

	<Route path="/Galleries/KNC">
		<KnCStyleGallery 
		images = {kncImages}
		numberOfColumns = {5}
		objWidth={"200px"}
		gridWidth={"90%"}
		imageWidth={"300px"}
	/>
	</Route>

	<Route path="/Info/Form">
	<InfoWithForm
		infoHeading="So much more than just a cafe"
		tinyTopText="odd little bit of text"
		infoPara="Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following."
		buttonText="About Us"
		buttonUrl="#"
		imgUrl="/img/icon.jpg"
		imgAlt=""
	/>
	</Route>

	<Route path="/Info/Left-Right">
		
		<LeftRightSection />


	</Route>


	<Route path="/contentful/events">
	<ContentfulEvents
		numberOfColumns = {4}
		objWidth={"200px"}
		gridWidth={"100%"}

	/>
	</Route>
	
	<Route path="/Tabs/Bordered">
		<TabBorder 
			componentArray = {componentArray}
			activeItem = {activeItem}
			on:tabChange={tabChange}
/>
	</Route>
	<Route path="Heroes/TwoColumns">
		<HeroTwoColumns />
	</Route>
	</main>
</Router>

<Slider
	images = {images}
	numberOfColumns = {4}
	objWidth={"200px"}
	gridWidth={"90%"}
	shouldAutoplay={true}
/>

<!-- <HeroTwoColumns /> -->



<style>


	
</style>