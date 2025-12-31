export const getProductImage = (name, dbImage) => {
    switch (name) {
        case 'Oranges': return '/fresh_fruits.png';
        case 'Banana': return '/bananas_packed.jpg';
        case 'Kiwi': return '/kiwi_pile.png';
        case 'Avocado': return '/avocado_pile.png';
        case 'Watermelon': return '/watermelon_pile.png';
        case 'Apple': return '/red_apples_packed.jpg';
        case 'Dates': return '/dates_glossy.png';
        case 'Dry Grapes': return '/dry_grapes_mix.png';
        case 'Apricot': return '/apricot_pattern.png';
        case 'Chia Seeds': return '/chia_seeds_spoon.png';
        case 'Flax Seeds': return '/flax_seeds_spoon.png';
        case 'Pumpkin Seeds': return '/pumpkin_seeds_bowl.png';
        case 'Protein Bar': return '/protein_bar.png';
        case 'Mixed Nuts': return '/mixed_nuts.png';
        default: return dbImage || '';
    }
};
