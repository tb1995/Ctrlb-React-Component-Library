<script>
import ArrowIconButton from "../../Widgets/Buttons/Arrow-Icon-Button.svelte"


export let infoHeading;
export let tinyTopText;
export let infoPara;
export let buttonText;
export let buttonUrl;
export let imgUrl;
export let imgAlt
export let fourGrids;
</script>

<div class="info-container">
    <div class="grid-container">
        {#each fourGrids as grid}
            <div class="grid">
                <div class="grid-heading">{grid.heading}</div>
                <div class="grid-paragraph">{grid.paragraph}</div>
            </div>
        {/each}
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

.grid-container {
    display: flex;
    justify-content: space-evenly;
    flex-wrap: wrap;
    align-items: flex-end;
    width: 33%;
      
     @include for-size(tablet-landscape-up) {

        margin-left: 80px;

        order: 2;
     }

    @include for-size(tablet-landscape-down) {
        order: 2;
        margin-left: 0;
        margin-top: 40px;
         width: 60%;
    }

    @include for-size(phone-only) {
        width: 100%;
        justify-content: space-evenly;
    
    }
}

.grid {
    flex: 0 1 40%;
    background-color: $dark-grey;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    height: 200px;
    width: 150px;
    margin-bottom: 20px;
    padding-left: 10px;
    padding-right: 10px;
    border-radius: 5px;

        @include for-size(phone-only){    
            
        }


        @include for-size(tablet-portrait-down) {                              
            flex: 0 1 80%;

        }


        @include for-size(tablet-landscape-only) {

                flex: 0 1 100%;

        }

       

}

.grid-heading {
    color: $white;
    text-align: center;
    font-size: 20px;
    font-weight: bold;
}

.grid-paragraph {
    color: $white;
    text-align: center;
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
                    order: 1;
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