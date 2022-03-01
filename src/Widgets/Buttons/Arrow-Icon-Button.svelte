<script>
    export let buttonText;
    export let buttonUrl;
</script>

<a href="{buttonUrl}" class="button">{buttonText} <img src="/img/arrow-right-long.svg" class="arrow" alt="Go to {buttonText}"></a>


<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';
.arrow {
  width: 15px;
  transition: transform 0.2s ease-in;
}

.button:hover .arrow{
    transform: scale(1.4) translateX(3px);
}

.button {
    color: $primary;
    text-decoration: none;
    font-size: 20px;
}

.button:hover {
    text-decoration: none;
    color: $accent;
}
</style>
