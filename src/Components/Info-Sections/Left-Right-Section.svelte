<script>

    export let infoArray = [
        {
            imgUrl: "/img/icon.jpg",
            imgAlt: "",
            title: "Where it all started",
            paragraph: "Kabab and Curry started from humble roots in Santa Clara, with the aim of creating a distinct culinary experience that would bring the flavors of East to the Bay Area."
        },
        {
            imgUrl: "/img/icon.jpg",
            imgAlt: "",
            title: "Growing in popularity",
            paragraph: "Soon after its launch, our humble restaurant caught the attention of the patrons of the Bay Area as well as critics. We soon garnered a fan-following that has made us the preferred dining spot for South Asian culinary delights."
        },
        {
            imgUrl: "/img/icon.jpg",
            imgAlt: "",
            title: "Bringing the best of flavor to the Bay Area",
            paragraph: "Over the last decade our restaurant chain has witnessed a fast expansion, including new branches at the MCA Mosque in Santa Clara, Cupertino and the unique cafe dining experience of Kettle'e Cafe. Our bold flavors have wowed our patrons and made  us a mainstay restaurant for the culinary adventurists."
        },
    ]
    export let heading = "Heading Text"
</script>

    <div class="left-right-container">
    <h2 class="info-section-heading">{heading}</h2>

    {#each infoArray as info}
        <div class="info-row">
            <img src="{info.imgUrl}" alt="{info.imgAlt}" class="info-image">
            <div class="info-text-container">
                <h3 class="info-row-heading">{info.title}</h3>
                <p class="info-row-paragraph">{info.paragraph}</p>
            </div>
        </div>
    {/each}
    </div>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.left-right-container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    width: 100%;
}

.info-row {
    width: 100%;
    margin: 0 auto;
    padding: 50px 15%;
    display: flex;
    justify-content: center;

    @include for-size(tablet-portrait-down) {
            padding: 50px 5%;
            flex-direction: column;
            flex-wrap: wrap;
    }

    @include for-size(tablet-landscape-up) {

            padding: 50px 5%;

    }

     @include for-size(tablet-desktop-up) {

            padding: 50px 15%;

    }

}

.info-row:nth-child(even) {
    background-color: $light-grey;

    .info-image {
        order: 1;
    }

    .info-text-container {
        order: 2;
        margin-left: 50px;
    }

    @include for-size(tablet-portrait-down) {
            .info-text-container {
                 margin-left: 0;
            }
    }

}

.info-row:nth-child(odd) {
    background-color: #fff;

     .info-image {
        order: 2;
    }

    .info-text-container {
        order: 1;
    }

            @include for-size(tablet-portrait-down) {
               .info-image {
                    order: 1;
                }

                .info-text-container {
                    order: 2;
                }

        }
}

.info-text-container {
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    width: 60%;

        @include for-size(tablet-portrait-down) {
                width: 100%;
        }
}

.info-row-heading {
    font-size: 24px;
    font-weight: 500;
    margin-bottom: 30px;
    @include for-size(tablet-portrait-down) {
                text-align: center;
    }
}

.info-row-paragraph {
    font-size: 18px;
    font-weight: 400;
    width: 70%;
    line-height: 1.7;
    @include for-size(tablet-portrait-down) {
                text-align: center;
                width: 90%;
                margin: auto;

    }

        @include for-size(tablet-landscape-up) {

                width: 85%;


    }

     @include for-size(tablet-desktop-up) {

                width: 70%;

    }
}


</style>