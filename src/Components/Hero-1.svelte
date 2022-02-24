<script>

const h1 = "Bakery. Breakfast. Lunch. Perfection."
const p = "Reinvented Pakistani and Indian flavors in a beautiful ambiance.";
const ctaText = "Order Now"
const ctaUrl = "#"
</script>

<div class="hero-1-container">

    <div class="text-container">
    <h1 class="hero-heading">{h1}</h1>
    <p class="hero-para">{p}</p>
    <a href="{ctaUrl}" class="hero-cta">{ctaText}</a>
    </div>
</div>


<style type="text/scss">
@import './public/scss/theme.scss';

.hero-1-container {
    height: 100vh;
    width: 100%;
    background-image: url("/img/hero-banner.jpg");
    background-size: cover;
    display: flex;
    align-items: center;
    
}

.text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: $body-left-margin;
}

.hero-heading {
    color: $primary;
    max-width: 60%;
}

.hero-para {
    color: $dark-grey;
}

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