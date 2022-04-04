<script>
    export let itemList = [
                     {
                         title: "Chicken Tikka Masala",
                         description: "Boneless pieces of chicken breast marinated in spices; baked over charcoal and then cooked in onion & tomato sauces along with cream. smooth texture. ",
                         cost: "$10.99"
                     },
                     {
                         title: "Butter Chicken",
                         description: "Boneless pieces of chicken leg marinated in spices; baked over charcoal and then cooked in onion & tomato sauces along with cream for smooth texture. ",
                         cost: "$10.99"
                     },
                     {
                         title: "Chicken Korma",
                         description: "More traditional curry using chicken meat with bones cooked in yogurt and onion gravy.",
                         cost: "$9.99"
                     },
                     {
                         title: "Chicken Karahi",
                         description: "Chicken cooked in traditional pathan-style tomato sauce along with fresh bell peppers, tomatoes and onion. With final sauce with fresh chopped garlic.",
                         cost: "$10.99"
                     },
                     {
                         title: "Saag Chicken",
                         description: "Spinach cooked with chicken given best of both worlds veg. and non-veg. ",
                         cost: "$10.99"
                     },
                     {
                         title: "Murgh Choley",
                         description: "Garbanzo beans and chicken cooked using tomato and onion sauce.",
                         cost: "$10.99"
                     },
                 ];
</script>

<div class="section-container">
    {#each itemList as item}
    <div class="item">
        <p class="item-title">{item.title}</p>
        <p class="item-description">{item.description}</p>
        <p class="item-cost">{item.cost}</p>
    </div>
    {/each}
</div>

<style type="text/scss">
@import './public/scss/theme.scss';
@import './public/scss/breakpoints.scss';

.section-container {
    display: flex;
    background-color: #950103;
    width: 100%;
    flex-wrap: wrap;
    justify-content: space-around;
    padding: 30px 0;
}

.item {
    display: flex;
    flex-direction: column;
    flex: 0 1 35%;
    position: relative;

}

.item-title {
    font-weight: bold;
    color: #fff;
}

.item-description {
    color: #fff;
}

.item-cost {
    color: #fff;
    font-weight: bold;
    position: absolute;
    bottom: 0;
    right: 0;

}


</style>