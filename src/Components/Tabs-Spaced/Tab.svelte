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
    justify-content: space-evenly;
    padding: 0;
    list-style-type: none;
}

li {
    margin: 0 16px;
    font-size: 18px;
    color: $dark-grey;
    cursor: pointer;
    width: 200px;
    text-align: center;
}

.active {
    color: $primary;
    border-bottom: 2px solid $primary;
    padding-bottom: 8px;
}
</style>