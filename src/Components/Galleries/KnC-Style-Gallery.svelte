<script>
    import { beforeUpdate, afterUpdate } from 'svelte';

    export let images;
    export let gridWidth;
    export let imageWidth;
    export let numberOfColumns;
    console.log(images)
        numberOfColumns += 1;
let flexWidth = (100 / numberOfColumns) + "%";

    let dividor = Math.min(images.length, 4)
    console.log(dividor)
    let widthOfImage = (100 / numberOfColumns) + "%";

    	beforeUpdate(() => {

    let remainder = images.length % numberOfColumns;

    // for(let i = 0; i < (numberOfColumns - remainder); i++) {
    //     console.log("Here " + i);
    //     images.push({
    //     invisible: true,
    //     src: "",
    //     alt: "ThisIsInvisible123",
    //     caption: ""
    // })
    // }

    })


</script>

<div class="gallery-container" style="width: {gridWidth}">

    {#each images as image}

    <div class="image-container  {image.alt ==='ThisIsInvisible123' ? 'invisible-obj' : ''}" style="flex: 1 1 {widthOfImage}" 
   >
        <img class="image" src="{image.src}" alt="{image.alt}" style="width: 100%" 
        >
<p class="image-caption">{image.caption}</p>
    </div>

        
    {/each}
</div>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.gallery-container {
        display: flex;
        justify-content: center;
        margin: auto;
        height: 700px;
        flex-wrap: wrap;
}

.invisible-obj {
        height: 0;
        visibility: hidden;
}

.image {
    height: 700px;
        @include for-size(tablet-landscape-down) {
                filter: grayscale(0%) brightness(0.5);

        }

    filter: grayscale(100%) brightness(0.6);
    transition: all 0.5s ease-in ;
    
}

.image:hover {
    filter: grayscale(0%) brightness(0.7);
}

.image-container {
        margin-right: 10px;
        position: relative;

    @include for-size(tablet-landscape-down) {
            flex: 0 1 100% !important;
                margin-right: 0;

    }
}

.image:last-child {
    margin-right: 0;
}

.image-caption {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 30px;
  font-weight: bold;
  color: white;
  text-align: center;
}

</style>