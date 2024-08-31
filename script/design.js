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
        <div class="pokemon-card" style="background-color: ${typeColor}" data-id="${pokemon.id}" onclick="openModal(pokemons.findIndex(p => p.id === ${pokemon.id}))">
            <h2>${capitalizedName}</h2>
            <img src="${imageUrl}" alt="${pokemon.name}">
            <div class="info">
                <p>Basis-Erfahrung: ${pokemon.base_experience}</p>
                <p>Gewicht: ${pokemon.weight} Kg</p>
            </div>
        </div>
    `;
}


function createPokemonDetailsTemplate(pokemon) {
    if (!pokemon) return ""; // Wenn kein Pokémon-Objekt vorhanden ist, gib eine leere Zeichenkette zurück
    const capitalizedName = capitalizeFirstLetter(pokemon.name); // Erhalte den Namen mit Großbuchstaben am Anfang
    const imageUrl = createPokemonImageUrl(pokemon.id); // Hole den Bild-URL (angenommen, diese Funktion existiert)
    const typeList = pokemon.types.map(type => type.type.name).join(', '); // Erstelle eine kommagetrennte Liste der Typen
    // Grundstruktur des HTML-Templates erstellen
    let detailsTemplate = `
    <div class="modal-content-wrapper">
        <h3>${capitalizedName}</h3>
        <div class="pokemon-image-container">
            <img src="${imageUrl}" alt="${pokemon.name}">
        </div>
    </div>
    <div class="tabs">
        <button class="tablink" onclick="openTab(event, 'attacks')">Attacken</button>
        <button class="tablink" onclick="openTab(event, 'abilities')">Fähigkeiten</button>
        <button class="tablink" onclick="openTab(event, 'stats')">Statistiken</button>
    </div>
    `;

    // Inhalt für den "Attacken"-Tab erstellen
    const attackList = pokemon.moves.map(move => `<li>${capitalizeFirstLetter(move.move.name)}</li>`).join('');
    detailsTemplate += `
        <div id="attacks" class="tabcontent">
            <ul>
                ${attackList}
            </ul>
            <div class="closing">
                <button class="close" onclick="closeTab()">Schließen</button>
            </div>
        </div>
        
    `;
    // **(Optional) Inhalt für andere Tabs hinzufügen:**
    // Hier kannst du den Inhalt für die Tabs "Fähigkeiten" und "Statistiken" hinzufügen.
    // Verwende dafür die entsprechenden Daten aus dem Pokémon-Objekt (z.B. pokemon.abilities)
    return detailsTemplate;
}


function openTab() {
    document.getElementById('attacks').style.display = 'grid'
}


function closeTab() {
    document.getElementById('attacks').style.display = 'none';
}
















