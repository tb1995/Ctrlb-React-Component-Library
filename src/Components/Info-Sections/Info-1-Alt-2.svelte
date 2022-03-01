<script>
import ArrowIconButton from "../../Widgets/Buttons/Arrow-Icon-Button.svelte"


export let infoHeading;
export let tinyTopText;
export let infoPara;
export let buttonText;
export let buttonUrl;
export let imgUrl;
export let imgAlt
</script>

<div class="info-container">
    <div class="img-container">
        <img src="{imgUrl}" alt="{imgAlt}" class="info-img">
    </div>
        <div class="info-text-container">
            <p class="tiny-text">{tinyTopText}</p>
            <h2 class="info-heading">{infoHeading}</h2>
            <p class="info-para">{infoPara}</p>
            <ArrowIconButton 
                {buttonText}
                {buttonUrl}/>
        </div>
</div>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.info-container {
    display: flex;
    justify-content: center;
    width: 100%;
    background: $light-grey;
    padding: 50px 0;

    @include for-size(phone-only) {
        flex-wrap: wrap;
    }
    @include for-size(tablet-portrait-up) {
                flex-wrap: wrap;

}

@include for-size(tablet-landscape-up) {
            flex-wrap: wrap;
}

@include for-size(desktop-up) {
            flex-wrap: nowrap;
}
}

.img-container {
    display: flex;
    justify-content: left;
    width: 40%;
         @include for-size(phone-only) {
        width: 100%;
        justify-content: center;

    }
     @include for-size(tablet-landscape-up) {

        justify-content: flex-end;
        margin-left: 80px;

        order: 2;
     }

    @include for-size(tablet-landscape-down) {
        order: 1;
        justify-content: center;
        margin-left: 0;

    }
}
.info-img {
    // width: 400px;
    // height: 400px;
}

.info-text-container {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    @include for-size(phone-only) {
           

        }

         @include for-size(tablet-landscape-up) {
            order: 1;
         }

                  @include for-size(tablet-landscape-down) {
                     width: 90%;
                    margin-top: 30px;
                    margin-left: $body-left-margin;
                    margin-right: $body-right-margin;
                    align-items: center;
                    order: 2;
                  }

            @include for-size(desktop-up) {
                    width: 40%;
            }
}

.tiny-text {
    color: $dark-grey;
    font-size: 18px;
    margin-bottom: 20px;
}
.info-heading {
    color: $dark-grey;
}

.info-para {
    margin: 50px 0;

        @include for-size(tablet-landscape-down) {
            text-align: center;
        }
}




</style>