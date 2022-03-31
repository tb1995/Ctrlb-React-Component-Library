<script>
    import {onMount} from 'svelte'
    export let backgroundImageUrl = "";
    export let overlayTitle = "";
    export let column1TopText = ""
    export let column1MiddleText = ""
    export let column1BottomText = ""

    export let column2TopText = ""
    export let column2MiddleText = ""
    export let column2BottomText = ""

    onMount( () => {
        console.log("background Image: " + backgroundImageUrl)
        console.log("overrlay title: " + overlayTitle)
        console.log("column1 text: " + column1TopText)

    })
</script>

<!--   style="background-image: url({backgroundImageUrl}"  -->
    <div class="section-container">)
        <div class="overlay-container">
        <h3 class="overlay-title">{overlayTitle}</h3>
          <div class="column-container">
            <div class="column-1 column">
                <p class="column-1-top-text top-text">{column1TopText}</p>
                <p class="column-1-middle-text middle-text">{column1MiddleText}</p>
                <div class="column-1-bottom-text bottom-text">{column1BottomText}</div>
            </div>
            <hr class="column-separator"/>
            <div class="column-2 column">
                <p class="column-2-top-text top-text">{column2TopText}</p>
                <p class="column-2-middle-text middle-text">{column2MiddleText}</p>
                <div class="column-2-bottom-text bottom-text">{column2BottomText}</div>
            </div>
        </div>
        </div>
    </div>


<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';


    .section-container {
        display: flex;
        width: 100%;
        height: 80vh;
        justify-content: center;
        align-items: center;
        position: relative;
    }

  .section-container::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: var(--backgroundImageUrl);
    filter: brightness(0.5);
    z-index: -1;
    
    }


    .filter-div {
        width: 70%;
        height: fit-content;
        padding: 30px 30px;
        background-color: $primary;

    }

    .overlay-container {
        display: flex;
        flex-direction: column;
        // justify-content: space-around;
        // align-items: center;
        position: relative;
        background-color: rgba(165, 165, 4, 0.5);
        backdrop-filter: opacity(0.5);

    }

    .column-container {
        display: flex;
        justify-content: space-between;
        // align-items: center;
        padding: 20px 0;
    }

    .column {
        flex: 0 1 40%;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-direction: column;
    }

    .column-separator {
        background-color: #fff;
        height: 150px;
        width: 2px;
    }


    .overlay-title {
        text-align: center;
        font-size: 24px;
        color: #fff;
    }
    .top-text {
        font-weight: bold;
        color: #fff;
        text-align: center;
        white-space: pre-wrap;
        font-size: 20px;
    }

    .middle-text {
        font-weight: normal;
        color: #fff;
        text-align: center;
        font-size: 20px;


    }

    .bottom-text {
        font-weight: bold;
        color: #fff;
        text-align: center;
        font-size: 20px;


    }


</style>