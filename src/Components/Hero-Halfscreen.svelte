<script>

const h1 = "CtrlB Component Library"
const p = ""

</script>


<div class="hero-container">
    <div class="text-container">
    <h1 class="hero-heading">{h1}</h1>

    </div>
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