<script>


        import { beforeUpdate, afterUpdate } from 'svelte';
        import { Router, Route, Link } from "svelte-navigator";
        import HeroHalfscreen from "../Hero-Halfscreen.svelte"
    import HeroFullscreen from "../Hero-Fullscreen.svelte";
    import {masterComponentArray} from "../../data.js"
    import Info_1 from "../Info-1.svelte";
    import Tab from "../Tabs-Spaced/Tab.svelte"


const tabChange = (e) => {
		activeItem = e.detail;
	}




export let array;
export let numberOfColumns;
export let objWidth;
export let gridWidth;

numberOfColumns += 1;
let flexWidth = (100 / numberOfColumns) + "%";


//         if(array.length % 4 === 2) {
//             console.log("Here");
//     array.push({
//         title: "ThisIsInvisible123",
//         imgUrl: "/img/icon.jpg",
//         invisible: true
//     })
//     console.log("Array length: " + array.length)
// } else if(array.length % 3 === 1) {
//     for(let i=0; i<2; i++) {
//         console.log("Here " + i);
//         array.push({
//         title: "ThisIsInvisible123",
//         imgUrl: "/img/icon.jpg",
//         invisible: true
//     })
//     }
// }

	beforeUpdate(() => {

    let remainder = array.length % numberOfColumns;

    for(let i = 0; i < (numberOfColumns - remainder); i++) {
        console.log("Here " + i);
        array.push({
        title: "ThisIsInvisible123",
        invisible: true,
        url: ""
    })
    }

    })


</script>
<Router>
<div class="grid-container" style="width: {gridWidth}">
    {#each array as obj}
    
        <div class="obj {obj.title === 'ThisIsInvisible123' ? 'invisible-obj' : ''}" style="flex: 0 1 {flexWidth}">

        <img src="{obj.imgUrl}" alt="" class="obj-img" style="width: {gridWidth}; height: {gridWidth}">

            <div class="text-container" style="width: {gridWidth}">

            <Link to="{obj.url}"> <p class="title">{obj.title}</p> </Link>
            
            </div>
        </div>
    {/each}
</div>
<!-- 
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
	 -->
</Router>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

    $column-width: 300px;

    .grid-container {
        display: flex;
        flex-wrap: wrap;
        margin: 50px auto;
        justify-content: space-evenly;
    }
    .obj {
        flex: 0 1 25%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
        margin-right: 10px;
    }

    .invisible-obj {
        height: 0;
        visibility: hidden;
    }

    .text-container {
        display: flex;
        align-items: center;
        justify-content: center;
        background-color: $light-grey;
        border: 1px solid $primary;
        min-width: 250px;
    }

    .obj-img {
        // width: $column-width;
        // height: $column-width;
        min-width: 250px;
        min-height: 250px;
    }

    .title {
        color: $primary;
        margin-top: 30px;
    }

</style>