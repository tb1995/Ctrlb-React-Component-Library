<script>

const infoHeading ="So much more than just a cafe"
const infoPara = "Kettle'e was started by the talented team of foodies at Kabab & Curry to expand their culinary horizons with medleys of different cuisines along with Indian and Pakistani food. Set in a picturesque setting, the cafe has become a mainstay in the Santa Clara area and has grown a unique fan following."
const infoCtaText = "About Us"
const infoCtaUrl = "#"
const infoImageUrl = "/img/icon.jpg"
</script>

<div class="info-container">
<div class="img-container">
    <img src="{infoImageUrl}" alt="" class="info-img">
</div>
    <div class="info-text-container">
        <h2 class="info-heading">{infoHeading}</h2>
    <p class="info-para">{infoPara}</p>
    <a href="{infoCtaUrl}" class="info-cta btn-style">{infoCtaText}</a>
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
}
.info-img {
    // width: 400px;
    // height: 400px;
}

.info-text-container {
    width: 50%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    @include for-size(phone-only) {
            width: 90%;
            margin-top: 30px;
            margin-left: $body-left-margin;
            margin-right: $body-right-margin;
            align-items: center;

        }

            @include for-size(desktop-up) {
                    width: 40%;
            }
}

.info-heading {
    color: $dark-grey;
}

.info-para {
    margin: 50px 0;
}




</style>