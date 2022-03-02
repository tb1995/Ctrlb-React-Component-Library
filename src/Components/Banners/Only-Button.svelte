<script>
import RectangularButton from "../../Widgets/Buttons/Rectangular-Button.svelte";

    export let buttonText;
    export let buttonUrl;
</script>

<div class="banner">
    <RectangularButton 
        {buttonText}
        {buttonUrl}    
    />
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
    height: 18vh;
}
</style>