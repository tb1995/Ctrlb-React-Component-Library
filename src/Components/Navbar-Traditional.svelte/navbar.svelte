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
    <ul class="nav-links">
        {#each navbarArray as navItem}
            <li>
                <a href="{navItem.url}">{navItem.label}</a>
            </li>
        {/each}
    </ul>
<div class="burger {isActive ? 'nav-active' : ''}" on:click="{navToggle}">
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

        @include for-size(phone-only) {
            position: absolute;
            right: 0;
            height: 92vh;
            top: 8vh;
            background-color: $primary;
            flex-direction: column;
            align-items: center;
            transform: translateX(100%);
            transition: transform 0.5 ease-in;
            background-color: red;

        }

        @include for-size(tablet-portrait-up) {
            width: 50%;
        }

        @include for-size(tablet-landscape-up) {
            width: 40%;
        }
        @include for-size(desktop-up) {
            width: 50%;
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
        transform: translateX(0);
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



