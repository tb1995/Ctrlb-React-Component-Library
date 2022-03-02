<script>
import RectangularButton from "../../Widgets/Buttons/Rectangular-Button.svelte";

    export let buttonText;
    export let buttonUrl;
    export let paragraph;
</script>

<div class="banner">
    <div class="text-container">
    <p class="paragraph">{paragraph}</p>
    </div>
    <div class="button-container">
    <RectangularButton 
        {buttonText}
        {buttonUrl}    
    />
    </div>
</div>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.banner {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: $dark-grey;
    height: 25vh;
}

.text-container {
    flex: 0 1 50%;
}

.button-container {
    flex: 0 1 20%;
    margin-left: 60px;
}

.paragraph {
    color: $white;
    margin-bottom: 0;
}

</style>