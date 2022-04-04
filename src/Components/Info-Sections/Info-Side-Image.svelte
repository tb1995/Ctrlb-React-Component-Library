<script>
import RectangularButton from "../../Widgets/Buttons/Rectangular-Button.svelte";

    // export let backgroundImageUrl = "url(/img/6.jpg)";
    // export let backgroundImageAltUrl = "url(/img/7.png)"
    export let heading = "Our Menu";

    export let hasCTA = true;
    export let ctaText = "Order Now";
    export let ctaUrl = "";


</script>

<div class="section-container">

<div style="" alt="" class="image-strip">
</div>
    <div class="content-container">
    <h2 class="section-heading">{heading}</h2>
    <slot>

    </slot>

    {#if hasCTA}
        <RectangularButton
        buttonText = {ctaText}
        buttonUrl = {ctaUrl}
        />
    {/if}
    </div>

</div>


<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.section-container {
    display: flex;
    justify-content: center;
    background-color: red;
    height: 70vh;

        @include for-size(tablet-portrait-down) {

            flex-direction: column;

        }
    // align-items:;
}

.image-strip {
    flex: 0 1 10%;
    height: 100%;
    background-image: var(--backgroundImageUrl);
    background-size: cover;


            @include for-size(tablet-portrait-down) {
                flex: 0 1 100%;
                height: 10%;
                background-image: var(--backgroundImageAltUrl);
                background-size: cover;

                // transform: rotate(90deg);

            }
}

.content-container {
    display: flex;
    flex-direction: column;
    flex: 0 1 90%;
    justify-content: space-between;
    padding: 50px 30px;

        @include for-size(tablet-portrait-down) {
            flex: 0 1 100%;
        }
}

.section-heading {
    font-weight: bold;
    color: #fff;
}


</style>