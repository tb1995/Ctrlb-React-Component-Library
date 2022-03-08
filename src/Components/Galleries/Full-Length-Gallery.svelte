<script>
    import { beforeUpdate, afterUpdate } from 'svelte';

    export let images;
    export let gridWidth;
    export let numberOfColumns;
    // numberOfColumns += 1;
let flexWidth = (100 / numberOfColumns) + "%";

    let dividor = Math.min(images.length, 4)
    console.log(dividor)
    let widthOfImage = (100 / numberOfColumns) + "%";

    	beforeUpdate(() => {

    let remainder = images.length % numberOfColumns;

    for(let i = 0; i < (numberOfColumns - remainder); i++) {
        console.log("Here " + i);
        images.push({
        invisible: true,
        src: "",
        alt: "ThisIsInvisible123"
    })
    }

    })


</script>

<div class="gallery-container" style="width: {gridWidth}">

    {#each images as image}

    <div class="image  {image.alt ==='ThisIsInvisible123' ? 'invisible-obj' : ''}" style="flex: 0 1 {widthOfImage}" 
   >
        <img class="image" src="{image.src}" alt="{image.alt}" style="width: {gridWidth}; height: {gridWidth}" >
    </div>

        
    {/each}
</div>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.gallery-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: space-evenly;
        margin: auto;
}

.invisible-obj {
        height: 0;
        visibility: hidden;
}

.image {

}


</style>