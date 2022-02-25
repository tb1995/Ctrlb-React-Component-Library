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
@import './public/scss/breakpoints.scss';


.hero-1-container {
    height: 100vh;
    width: 100%;
    background-image: url("/img/hero-banner.jpg");
    background-size: cover;
    display: flex;
    align-items: center;
    filter: brightness(90%);
    
}

.text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: $body-left-margin;

        @include for-size(phone-only) {
            width: 90%;
            margin-left: $body-left-margin;
            margin-right: $body-right-margin;
            align-items: center;

        }


}

.hero-heading {
    color: $primary;
    max-width: 60%;


    @include for-size(phone-only) {
                font-size: 60px;
                width: 100%;
                text-align: center;
           }


    @include for-size(tablet-portrait-up) {
                font-size: 50px;
                max-width: 77%;
                text-align: left;


    }   

    @include for-size(tablet-landscape-up) {
                font-size: 80px;
                max-width: 77%;
        

    }

    @include for-size(desktop-up) {
                font-size: 100px;
                max-width: 67%;
    }

    @include for-size(big-desktop-up) {
                max-width: 60%; 
                font-size: 120px;
    }

}

.hero-para {
    color: $dark-grey;
    @include for-size(phone-only) {
                font-size: 24px;
                width: 100%;
                text-align: center;
    }
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


@include for-size(small-phone-only) {
.hero-heading {

        }
}

@include for-size(large-mobile-up) {

}

@include for-size(tablet-portrait-up) {

}

@include for-size(tablet-landscape-up) {

}

@include for-size(desktop-up) {

}

@include for-size(big-desktop-up) {

}

</style>