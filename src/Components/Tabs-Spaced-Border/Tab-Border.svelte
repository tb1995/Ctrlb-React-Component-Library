<script>

    import {createEventDispatcher} from 'svelte'
    
    const dispatch = createEventDispatcher();
    export let componentArray;
    export let activeItem;

</script>

<div class="tabs">
<ul>
    {#each componentArray as item}
    <li on:click="{() => dispatch('tabChange', item.label)}" class:active={item.label === activeItem}>
        <div>{item.label}</div>
    </li>
     {/each}
</ul>
</div>


<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.tabs {
    margin-bottom: 40px;
}

ul {
    display: flex;
    justify-content: center;
    padding: 0;
    list-style-type: none;
}

li {
    margin: 0 16px;
    font-size: 18px;
    color: $dark-grey;
    cursor: pointer;
    border: 1px solid #333;
    width: 160px;
    height: 50px;
    text-align: center;
    line-height: 50px;
}

li > div {
    font-size: 14px;
}

.active {
    background-color: $primary;
    // color: $white;
    border: 1px solid $primary;
    font-weight: bold;

}
</style>