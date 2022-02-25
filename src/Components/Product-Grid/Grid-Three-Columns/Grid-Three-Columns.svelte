<script>


    	import { beforeUpdate, afterUpdate } from 'svelte';

const array = [
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
];

	beforeUpdate(() => {
    console.log("Array length: " + array.length)

        if(array.length % 3 === 2) {
            console.log("Here");
    array.push({
        title: "ThisIsInvisible123",
        imgUrl: "/img/icon.jpg",
        invisible: true
    })
    console.log("Array length: " + array.length)
} else if(array.length % 3 === 1) {
    for(let i=0; i<2; i++) {
        console.log("Here " + i);
        array.push({
        title: "ThisIsInvisible123",
        imgUrl: "/img/icon.jpg",
        invisible: true
    })
    }
}

	});


</script>

<div class="grid-container">
    {#each array as obj}
        <div class="obj {obj.title === 'ThisIsInvisible123' ? 'invisible-obj' : ''}">
        <img src="{obj.imgUrl}" alt="" class="obj-img">
            <div class="text-container">
            <p class="title">{obj.title}</p>
            </div>
        </div>
    {/each}
</div>


<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';


    .grid-container {
        display: flex;
        flex-wrap: wrap;
        width: 100%;
        justify-content: space-evenly;
    }
    .obj {
        flex: 0 1 33%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        margin-top: 30px;
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
        width: 398px;
        border: 1px solid $primary;
    }

    .obj-img {
        width: 400px;
        height: 400px;
    }

    .title {
        color: $primary;
        margin-top: 30px;
    }

</style>