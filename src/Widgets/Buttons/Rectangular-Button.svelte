<script>
    export let buttonText;
    export let buttonUrl;
</script>

    <a href="{buttonUrl}" class="hero-cta">{buttonText}</a>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

 .hero-cta {
    width: 250px;
    height: 60px;
    background-color: $primary;
    color: $white !important;
    border-radius: 5px;
    font-size: 24px;
    z-index: 3;
    display: block;
    /* margin: 0 auto; */
    line-height: 60px;
    text-align: center;
  }
</style>


