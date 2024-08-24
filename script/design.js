function capitalizeFirstLetter(string) {
    return string.replace(/^\w/, (c) => c.toUpperCase());
}


function createPokemonImageUrl(pokemonId, isShiny = false) {
    const baseUrlOfficialArtwork = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
    const baseUrlDefault = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

    // Dynamische URL je nach Artwork-Typ
    const baseUrl = isShiny ? `${baseUrlOfficialArtwork}shiny/` : baseUrlOfficialArtwork;
    const imageUrl = `${baseUrl}${pokemonId}.png`;
    return imageUrl;
}


function getTypeColor(type) {
    const typeColors = {
        grass: 'rgba(0,129,19,1)', 
        fire: 'rgba(191,0,0,1)', 
        water: 'rgba(0,33,255,1)', 
        electric: 'rgba(255,237,0,1)', 
    };
    return typeColors[type.toLowerCase()] || 'rgba(0,0,0,0.4)'; 
}


function pokemonDesign(pokemon) {
    const capitalizedName = capitalizeFirstLetter(pokemon.name);
    const imageUrl = createPokemonImageUrl(pokemon.id);
    const typeColor = getTypeColor(pokemon.types[0].type.name);

    return `
        <div class="pokemon-card" style="background-color: ${typeColor}" data-id="${pokemon.id}" onclick="openModal(${pokemon.id})">
            <h2>${capitalizedName}</h2>
            <img src="${imageUrl}" alt="${pokemon.name}">
            <div class="info">
                <p>Basis-Erfahrung: ${pokemon.base_experience}</p>
                <p>Gewicht: ${pokemon.weight} Kg</p>
            </div>
        </div>
    `;
}





