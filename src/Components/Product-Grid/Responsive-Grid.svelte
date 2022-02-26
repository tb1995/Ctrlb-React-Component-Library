<script>


    	import { beforeUpdate, afterUpdate } from 'svelte';

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
        imgUrl: "/img/icon.jpg",
        invisible: true
    })
    }

    })


</script>

<div class="grid-container" style="width: {gridWidth}">
    {#each array as obj}
<div class="obj {obj.title === 'ThisIsInvisible123' ? 'invisible-obj' : ''}" style="flex: 0 1 {flexWidth}">
<img src="{obj.imgUrl}" alt="" class="obj-img" style="width: {gridWidth}; height: {gridWidth}">
            <div class="text-container" style="width: {gridWidth}">
            <p class="title">{obj.title}</p>
            </div>
        </div>
    {/each}
</div>


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
        min-width: 200px;
    }

    .obj-img {
        // width: $column-width;
        // height: $column-width;
        min-width: 200px;
        min-height: 200px;
    }

    .title {
        color: $primary;
        margin-top: 30px;
    }

</style>