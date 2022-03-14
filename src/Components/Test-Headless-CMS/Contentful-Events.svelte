<script>


import { beforeUpdate, afterUpdate, onMount } from 'svelte';
import { Router, Route, Link } from "svelte-navigator";
import HeroHalfscreen from "../Hero-Halfscreen.svelte"
import HeroFullscreen from "../Hero-Fullscreen.svelte";
import {masterComponentArray} from "../../data.js"
import Info_1 from "../Info-1.svelte";
import Tab from "../Tabs-Spaced/Tab.svelte"
import ArrowIconButton from '../../Widgets/Buttons/Arrow-Icon-Button.svelte';
import { createClient } from "contentful"





let remainder

onMount(() => {
    console.log("test")
    var client = createClient({
    space: 'voutmqui4m2l',
    accessToken: 'Pch2QB-Irp5JmCIl0DTH_7wCMNWZtNQe5oFsM7CYRo8',
    });


    const res = client.getEntries({content_type: 'events'}).then(function (event) {
    // logs the entry metadata
    //   console.log(event.items);




    array = event.items;
    // logs the field with ID title
    console.log(array)
    // console.log(typeof(["Hello", "World"]))



    remainder = array.length % numberOfColumns;

     for(let i = 0; i < (numberOfColumns - remainder); i++) {
        console.log("Here " + i);
        array.push({
        title: "ThisIsInvisible123",
        invisible: true,
        url: ""
    })


    }
        console.log(event.items.length)

     console.log(array)



    });

    

})


let array = [];

// console.log(array)
export let numberOfColumns;
export let objWidth;
export let gridWidth;

numberOfColumns += 1;
let flexWidth = (100 / numberOfColumns) + "%";




</script>
<Router>
<div class="grid-container" style="width: {gridWidth}">
    {#each array as obj}
    
        <div class="obj {obj.fields.title === 'ThisIsInvisible123' ? 'invisible-obj' : ''}" style="flex: 0 1 {flexWidth}">

        <img src="{obj.fields.image.fields.file.url}" alt="" class="obj-img" style="width: {gridWidth}; height: {gridWidth}">

            <div class="text-container" style="width: {gridWidth}">

            <Link to=""> <p class="title">{obj.fields.title}</p> </Link>
            <p class="paragraph">{obj.fields.description}</p>

            <p small class="paragraph">{obj.fields.dateAndTime}</p>

            <p small class="paragraph">{obj.fields.location.lat}, {obj.fields.location.lon}</p>


            
            <ArrowIconButton 
                buttonText={obj.buttonText}
                buttonUrl={obj.buttonUrl}
            /> 
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
        flex-direction: column;
        align-items: center;
        justify-content: center;
        background-color: $light-grey;
        border: 1px solid $primary;
        min-width: 250px;
        padding: 20px 30px;
    }

    .obj-img {
        // width: $column-width;
        // height: $column-width;
        min-width: 250px;
        min-height: 250px;
    }

    .title {
        color: $primary;
    }

</style>