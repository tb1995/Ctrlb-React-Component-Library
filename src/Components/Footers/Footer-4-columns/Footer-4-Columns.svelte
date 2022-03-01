<script>

import {navbarArray} from '../../../data'
import {iconList} from '../../../data'


export let linkList1 = navbarArray;
export let linkList2 = navbarArray;
export let footerDescription;

export let footerLogoUrl = "/img/logo.png"
export let footerLogoAlt = ""
export let contactList = iconList
export let CustomerName;
</script>

<div class="footer-container">
    <div class="description">
    <img src="{footerLogoUrl}" alt="{footerLogoAlt}" class="logo">
        <div class="description-text">
            {footerDescription}
        </div>
    </div>

    <div class="links">
        <ul class="links-list">
            {#each linkList1 as link}
                <li>
                <a href="{link.url}">{link.label}</a>
                </li>
            {/each}
        </ul>
        <ul class="links-list">
              {#each linkList1 as link}
                <li>
                <a href="{link.url}">{link.label}</a>
                </li>
            {/each}
        </ul>
    </div>
    <div class="contact">
        {#each contactList as contact}
            <div class="contact-row">
            <img src="{contact.iconUrl}" alt="{contact.iconAlt}" class="contact-logo">
            <p class="contact-text">{contact.label}</p>
            </div>
        {/each}
    </div>
</div>
<div class="copyright">
<p class="copyright-text">Copyright &copy; {CustomerName}</p>
</div>


<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

    .footer-container {
        display: flex;
        justify-content: space-evenly;
        width: 100%;
        background-color: $dark-grey;
        min-height: 50vh;
        align-items: center;

         @include for-size(tablet-landscape-down) {
            flex-wrap: wrap;
         }

        @include for-size(phone-only) {
                padding: 50px 0;
        }
    }

    .description {
        display: flex;
        flex-direction: column;
        flex: 0 1 25%;
        margin-left: 5rem;
         @include for-size(tablet-landscape-down) {
            flex: 0 1 40%;
            margin-left: 0;
         }
         @include for-size(phone-only) {
            flex: 0 1 100%;
            align-items: center;
            margin-left: 0;
            margin-bottom: 20px;
         }
    }

    .logo {
        width: 150px;
        height: 150px;
        margin-bottom: 10px;
    }

    .description-text {
        color: $white;
        width: 90%;
        line-height: 1.6;
        @include for-size(phone-only) {
            text-align: center;
        }
    }

    .links {
        display: flex;
        flex: 0 1 33%;
        justify-content: space-evenly;
        @include for-size(tablet-landscape-down) {
            flex: 0 1 40%;
         }
         @include for-size(phone-only) {
                flex: 0 1 100%;
                margin-bottom: 30px;
        }
        
    }

    .links-list {
        @include for-size(phone-only) {
            padding-left: 0;
            padding-inline-start: 0;
        }

        @include for-size(phone-only) {

        }

    }

    .links-list li {
        list-style-type: none;
        margin-bottom: 15px;
    }

    .links-list li a {
        color: $white;
        text-decoration: none;
        font-size: 18px;
        font-weight: 300;
    }

    .links-list li a:hover {
        color: $primary;
        text-decoration: none;
    }


    .contact {
        display: flex;
        flex-direction: column;
        flex: 0 1 33%;
        @include for-size(tablet-landscape-down) {
            flex: 0 1 100%;
            align-items: center;
         }
    }

    .contact-row {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
    }

    .contact-logo {
        width: 60px;
        height: 60px;
    }

    .contact-text {
        color: $white;
        font-weight: bold;
        font-size: 18px;
        margin-bottom: 0;
        margin-left: 30px;
    }

    .copyright {
        width: 100%;
        background-color: #010101;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 4vh;
    }

    .copyright-text {
        color: $white;
        font-size: 14px;
        font-weight: 300;
        margin: 0
    }
</style>