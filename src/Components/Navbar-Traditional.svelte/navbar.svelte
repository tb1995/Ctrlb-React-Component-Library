<script>
    import {navbarArray} from '../../data.js'
    const logoUrl = "/img/logo.png"
    const logoAlt = ""

    let isActive = false;
    function navToggle(e) {
        isActive = !isActive
    }

</script>

<nav>
    <div class="logo">
    <img class="logo" src="{logoUrl}" alt="{logoAlt}">
    </div>
    <ul class="nav-links {isActive ? 'nav-active' : ''}">
        {#each navbarArray as navItem, index}
    <li style="animation: navlinkFade 1.5s ease forwards {index / 7 + 2.8}s">
                <a href="{navItem.url}">{navItem.label}</a>
            </li>
        {/each}
    </ul>
<div class="burger" on:click="{navToggle}">
        <div class=""></div>
        <div class=""></div>
        <div class=""></div>
    </div>
</nav>


<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

    .logo {
        height: 80px;
        width: 80px;
    }

    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        min-height: 8vh;
        background-color: $primary;
        width: 100%;
        flex-wrap: wrap;
    }

    .nav-links {
        display: flex;
        width: 30%;
        justify-content: space-around;
        align-items: center;
        @include for-size(phone-only) {
        }

        @include for-size(tablet-portrait-down) {
            position: absolute;
            right: 0;
            height: 92vh;
            top: 77vh;
            background-color: $primary;
            flex-direction: column;
            align-items: center;
            transform: translateX(100%);
            transition: transform 0.5s ease-in;
            background-color: $primary;
            width: 70%;
            padding-left: 0;
        }

        @include for-size(tablet-landscape-up) {
            width: 90%;
        }
        @include for-size(desktop-up) {
            width: 70%;
        }   

    }


    .nav-links a {
        color: $white;
        text-decoration: none;
        letter-spacing: 3px;
        font-weight: bold;
        font-size: 16px;

    }

    .nav-links a:hover {
        text-decoration: none;
    }

    .nav-links li {
        list-style-type: none;
    }

    .nav-links li:last-child {
        background-color: $accent;
        padding: 20px 50px;
    }

    .nav-links li:last-child a {
        color: $white;
    }
    .burger {

        cursor: pointer;

        @include for-size(phone-only) {
            width: 25px;
            margin-right: 30px;

        }

        @include for-size(tablet-portrait-up) {
            width: 25px;
            margin-right: 30px;
        }
        @include for-size(tablet-landscape-up) {
            width: 100%;
        }
    }
    .burger div{
        width: 25px;
        height: 2px;
        margin: 5px;
        background-color: $white;

        @include for-size(phone-only) {
            display: block;
        }

        @include for-size(tablet-portrait-up) {
             display: block;
           

        }

        @include for-size(tablet-landscape-up) {
            display: none;
        }

    }

    .nav-active {
        transform: translateX(-1px);
    }

    @keyframes navlinkFade {
        from {
            opacity: 0;
            transform: translateX(50px);
        } 
        to {
            opacity: 1;
            transform: translateX(0px);
        }
    }

    /**

@include for-size(small-phone-only) {

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
    
    **/

</style>



