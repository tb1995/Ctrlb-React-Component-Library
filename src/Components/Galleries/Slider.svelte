<script>
    import { beforeUpdate, afterUpdate } from 'svelte';
    import { flip } from 'svelte/animate'
    import {ChevronLeftIcon, ChevronRightIcon} from 'svelte-feather-icons'
    export let images;
    export let gridWidth;
    export let numberOfColumns;
    export let shouldAutoplay = false;
    export let autoplaySpeed = 3000;

    let interval;
    // numberOfColumns += 1;
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
    //     id: images.length + i + 1
    // })
    // }

    })


function rotateLeft() {
  const transitioningImage = images[images.length - 1];
  document.getElementById("image"+transitioningImage.id).style.opacity=0
  images = [images[images.length - 1],...images.slice(0, images.length - 1)]

  setTimeout(() => {
    document.getElementById("image"+transitioningImage.id).style.opacity=1
  }, 3300)
}
function rotateRight() {
  images = [...images.slice(1, images.length), images[0]]
}

function startAutoplay() {
  if(shouldAutoplay) {
    interval = setInterval(rotateLeft, autoplaySpeed)
  }
}

function stopAutoplay() {
  clearInterval(interval);
}

if(shouldAutoplay) {
  startAutoplay();
}
</script>

<div class="gallery-container" style="width: {gridWidth}">

   
    <div class="image  "
   >
    {#each images as image (image.id)}
<img id="image{image.id}"class="image {image.alt ==='ThisIsInvisible123' ? 'invisible-obj' : ''}" src="{image.src}" alt="{image.alt}" style="height: {gridWidth}" animate:flip on:mouseover="{stopAutoplay}" on:mouseout="{startAutoplay}">
           {/each}
    </div>
        
 
    <button id="left" on:click="{rotateLeft}">
    <!-- <slot name="left-control"> </slot> -->
      <ChevronLeftIcon />
    </button>
    <button id="right" on:click="{rotateRight}">
      <ChevronRightIcon />
    </button>
</div>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.gallery-container {
        display: flex;
        flex-direction: column;
        // flex-wrap: wrap;
        justify-content: space-evenly;
        margin: auto;
        overflow-x: hidden;
        position: relative;
}

.invisible-obj {
        height: 0;
        visibility: hidden;
}

.image {
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 20px;
  // -webkit-mask: linear-gradient(to right, transparent, black 40%, black 60%, transparent);
  // mask: linear-gradient(to right, transparent, black 40%, black 60%, transparent);
}

button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  color: white;
  background: transparent;
  border: none
}

#left {
  left: 30px;
}

#right {
  right: 30px;
}

</style>