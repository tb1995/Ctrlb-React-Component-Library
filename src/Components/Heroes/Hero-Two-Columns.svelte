<script>

const h1 = "Simply \n" + "Delicious Food"
const p = "Tasty, simple, and halal Pakistani and Indian Cuisine at the most popular restaurants for the cuisine in the Bay Area.";
const ctaText = "Order Now"
const ctaUrl = "#"
export let isH1 = true
export let isImageFirst = false
</script>

<div class="hero-1-container">
<div class="column-1 {isImageFirst ? 'text-order-second' : 'text-order-first'}">
         <div class="text-container">
             {#if isH1}
                <h1 class="hero-heading">{h1}</h1>
             {/if}
             {#if !isH1}
                <h2 class="hero-heading">{h1}</h2>
             {/if}
            
            <p class="hero-para">{p}</p>
            <a href="{ctaUrl}" class="hero-cta">{ctaText}</a>
        </div>   
    </div>
    <div class="column-2 {isImageFirst ? 'image-order-first' : 'image-order-second'}"></div>

</div>


<style type="text/scss">
@import '../public/scss/theme.scss';
@import '../public/scss/breakpoints.scss';


.image-order-second {
    order: 2;

     @include for-size(tablet-portrait-down) {
                 order: 1;
    }   
}

.image-order-first {
    order: 1;

     @include for-size(tablet-portrait-down) {
                 order: 1;
    }   
}

.text-order-first {
    order: 1;

    @include for-size(tablet-portrait-down) {
                 order: 2;
    } 
}

.text-order-second {
    order: 2;

    @include for-size(tablet-portrait-down) {
                 order: 2;
    } 
}





.hero-1-container {
    height: 80vh;
    width: 100%;
    // background-image: url("/img/hero-banner.jpg");
    background-size: cover;
    display: flex;
    @include for-size(tablet-portrait-down) {
                 flex-wrap: wrap;
    } 
    
}

.column-1 {
    background-color: maroon;
    display: flex;
    align-items: center;
    flex: 0 1 50%;
    @include for-size(tablet-portrait-down) {
                 flex: 0 1 100%;
    } 
}

.column-2 {
    background-image: url("/img/KnC-bg.jpg");
    background-size: cover;
    flex: 0 1 50%;
    height: 100%;
    @include for-size(tablet-portrait-down) {
                 flex: 0 1 100%;
                 height: 650px;
                background-size: cover;

    } 

}


.text-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin-left: $body-left-margin;
    width: 60%;

        @include for-size(tablet-portrait-down) {
            width: 90%;
            margin-left: $body-left-margin;
            margin-right: $body-right-margin;
            align-items: center;

        }


}

.hero-heading {
    color: $primary;
    max-width: 100%;


    @include for-size(phone-only) {
                font-size: 60px;
                width: 100%;
                text-align: center;
           }


    @include for-size(tablet-portrait-up) {
                font-size: 60px;
                max-width: 77%;
                text-align: center;


    }   

    @include for-size(tablet-landscape-up) {
                font-size: 60px;
                max-width: 77%;
                text-align: left;

        

    }

    @include for-size(desktop-up) {
                font-size: 65px;
                max-width: 87%;
    }

    @include for-size(big-desktop-up) {
                max-width: 80%; 
                font-size: 100px;
    }

}

.hero-para {
    color: $white;
    font-weight: 300;
    line-height: 1.5;
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