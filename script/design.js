function capitalizeFirstLetter(string) {
    return string.replace(/^\w/, (c) => c.toUpperCase());
}


function createPokemonImageUrl(pokemonId, isShiny = false) {
    const baseUrlOfficialArtwork = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/";
    const baseUrlDefault = "https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/";

    const baseUrl = isShiny ? `${baseUrlOfficialArtwork}shiny/` : baseUrlOfficialArtwork;
    const imageUrl = `${baseUrl}${pokemonId}.png`;
    return imageUrl;
}


function getTypeColor(type) {
    const typeColors = {
        grass: 'rgba(0,129,19,0.1)', 
        fire: 'rgba(191,0,0,1)', 
        water: 'rgba(0,33,255,1)', 
        electric: 'rgba(255,195,10, 0.6)', 
        ice: 'rgba(62,182,118,0.4)',
        bug: 'rgba(168,164,0, 2)',
        ground: 'rgba(163,81,10,1)',
        poison: 'rgba(0,164,25,0.98)'
    };
    return typeColors[type.toLowerCase()] || 'rgba(180, 10, 10, 0.4)'; 
}


function pokemonDesign(pokemon) {
    const capitalizedName = capitalizeFirstLetter(pokemon.name);
    const imageUrl = createPokemonImageUrl(pokemon.id);
    const backgroundStyle = getPokemonBackgroundStyle(pokemon);

    return `
        <div class="pokemon-card" style="${backgroundStyle}" 
            data-id="${pokemon.id}" 
            onclick="openModal(pokemons.findIndex(p => p.id === ${pokemon.id}))">
            <h2>${capitalizedName}</h2>
            <img src="${imageUrl}" alt="${pokemon.name}">
            <div class="info">
                <p>Basis-Erfahrung: ${pokemon.base_experience}</p>
                <p>Gewicht: ${pokemon.weight} Kg</p>
            </div>
        </div>
    `;
}


function getPokemonBackgroundStyle(pokemon) {
    const type1 = pokemon.types[0].type.name;
    const type2 = pokemon.types[1] ? pokemon.types[1].type.name : null;

    const typeColor1 = getTypeColor(type1);
    const typeColor2 = type2 ? getTypeColor(type2) : typeColor1; 

    return type2 ? 
        `background: linear-gradient(45deg, ${typeColor1}, ${typeColor2});` : 
        `background-color: ${typeColor1};`;
}


function createPokemonDetailsTemplate(pokemon) {
    if (!pokemon) return ""; 

    const capitalizedName = capitalizeFirstLetter(pokemon.name);
    const imageUrl = createPokemonImageUrl(pokemon.id); 
    const evolutionChainId = pokemon.id; 

    let detailsTemplate = generateDetailsTemplateHTML(capitalizedName, imageUrl, pokemon.name, evolutionChainId);

    const attackList = pokemon.moves.map(move => `<li>${capitalizeFirstLetter(move.move.name)}</li>`).join('');
    detailsTemplate += generateAttacksTabHTML(attackList);

    return detailsTemplate;
}


function generateDetailsTemplateHTML(capitalizedName, imageUrl, pokemonName, pokemonId) {
    return `
    <div class="modal-content-wrapper">
        <!-- Header and image -->
        <h3>${capitalizedName}</h3>
        <div class="pokemon-image-container">
            <img src="${imageUrl}" alt="${pokemonName}">
        </div>

        <!-- Tab buttons -->
        <div class="tabs">
                <button id="attacksTabButton" class="tablink" onclick="openAttacksTab()">Attacken</button>
                <button id="developmentTabButton" class="tablink" onclick="openDevelopmentTab(${pokemonId})">Entwicklung</button>
        </div>
    </div>`;
}


function generateAttacksTabHTML(attackList) {
    return `
    <div id="attacks" class="tabcontent">
        <ul>
            ${attackList}
        </ul>
        <div class="closing"></div>
    </div>
    `;
}


function generateDevelopmentTabHTML() {
    return `
    <div id="evolution-tab" class="tabcontent evolution-tab">
    </div>
    `;
}


function generateFullTabContainer(attackList) {
    return `
    <div class="tab-container">
        ${generateAttacksTabHTML(attackList)}
        ${generateDevelopmentTabHTML()}
    </div>`;
}


function openAttacksTab() {
    document.getElementById('attacks').style.display = 'block';
    document.getElementById('evolution-tab').style.display = 'none';
}

function openDevelopmentTab() {
    document.getElementById('attacks').style.display = 'none';
    document.getElementById('evolution-tab').style.display = 'block';
}


let originalAttacksContent = ''; 

async function openDevelopmentTab(pokemonId) {
    if (originalAttacksContent === '') {
        originalAttacksContent = document.getElementById('attacks').innerHTML;
    }
    AUDIO_CLICK.play();

    const developmentButton = document.getElementById('developmentTabButton');
    developmentButton.style.outline = '1px solid white'; 

    const attacksButton = document.getElementById('attacksTabButton');
    attacksButton.style.outline = 'none'; 

    document.getElementById('attacks').innerHTML = ` 
        <div class="loader-container">
            <div class="loader"></div>
            <p>Lade Daten...</p>
        </div>`;

    console.log('Pokemon ID:', pokemonId);

    try {
        document.getElementById('attacks').innerHTML += generateDevelopmentTabHTML();
        const evolutionChainId = await fetchEvolutionChainId(pokemonId);
        await fetchEvolutionChains(evolutionChainId);
        document.querySelector('.loader-container').remove();
    } catch (error) {
        console.error('Fehler beim Laden der Evolutionskette:', error);
        document.getElementById('attacks').innerHTML = `<p>Fehler beim Laden der Entwicklung.</p>`;
    }
}


async function fetchEvolutionChainId(pokemonId) {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonId}`);
    const data = await response.json();

    if (data.evolution_chain) {
        return data.evolution_chain.url.split('/').slice(-2, -1)[0];
    } else {
        const speciesResponse = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`);
        const speciesData = await speciesResponse.json();
        if (speciesData.evolution_chain) {
            return speciesData.evolution_chain.url.split('/').slice(-2, -1)[0];
        } else {
            throw new Error('Evolutionskette nicht gefunden.');
        }
    }
}


async function fetchEvolutionChains(evolutionChainId) {
    try {
        const response = await fetch(`https://pokeapi.co/api/v2/evolution-chain/${evolutionChainId}`);
        if (!response.ok) throw new Error('Netzwerkantwort war nicht ok.');
        
        const data = await response.json();
        const evolutionHTML = renderEvolutionChainHTML(data.chain);
        const evolutionDiv = document.getElementById('evolution-tab');
        if (evolutionDiv) {
            evolutionDiv.innerHTML = `<div class="evolution-chain">${evolutionHTML}</div>`;
        } else {
            console.error('Das Element mit der ID "evolution-tab" wurde nicht gefunden.');
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der Evolutionsdaten:', error);
        document.getElementById('evolution-tab').innerHTML = `<p>Fehler beim Laden der Entwicklung.</p>`;
    }
}


function renderCurrentPokemonHTML(chain) {
    const currentPokemonId = chain.species.url.split('/').slice(-2, -1)[0]; 
    return `
        <div class="evolution-stage">
            <p class="poke-name">${capitalizeFirstLetter(chain.species.name)}</p> <!-- Name über dem Bild -->
            <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${currentPokemonId}.png" alt="${capitalizeFirstLetter(chain.species.name)}" class="evolution-image">
        </div>`;
}


function renderEvolutionChainHTML(chain, isCurrent = true) {
    let html = '';
    if (isCurrent) {
        html += renderCurrentPokemonHTML(chain);
    }

    if (chain.evolves_to.length > 0) {
        for (let evo of chain.evolves_to) {
            const evoId = evo.species.url.split('/').slice(-2, -1)[0];
            html += `
                <div class="evolution-stage">
                    <img src="assets/img/pfeil-nach-unten.png" alt="Pfeil" id="evolution-arrow"> 
                    <p class="poke-name">${capitalizeFirstLetter(evo.species.name)}</p> <!-- Name über dem Bild -->
                    <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${evoId}.png" alt="${capitalizeFirstLetter(evo.species.name)}" class="evolution-image">
                </div>`;
            html += renderEvolutionChainHTML(evo, false); 
        }
    }
    return html;
}


function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}


function openAttacksTab() {
    AUDIO_CLICK.play();

    const attacksButton = document.getElementById('attacksTabButton');
    attacksButton.style.outline = '1px solid white'; 

    const developmentButton = document.getElementById('developmentTabButton');
    developmentButton.style.outline = 'none'; 

    if (originalAttacksContent !== '') {
        document.getElementById('attacks').innerHTML = originalAttacksContent;
        originalAttacksContent = '';
    }
}