<script>
import RectangularButton from "../Widgets/Buttons/Rectangular-Button.svelte";


export let title;
export let subheading;
export let buttonText;
export let buttonUrl;

</script>


<div class="hero-container">
    <h1 class="hero-heading">{title}</h1>
    <p class="hero-subtext">{subheading}</p>
    <RectangularButton 
    {buttonText}
    {buttonUrl}
    />

</div>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.hero-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: $light-grey;
    width: 100%;
    height: 50vh;
    margin-bottom: 100px;
}

.hero-heading {
        color: $dark-grey;
}

</style>