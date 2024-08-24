let pokemons = [];

async function init() {
    try {
        // Grundlegende Pokémon-Daten abrufen
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=40');
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok.');
        }
        const data = await response.json();

        pokemons = data.results; // Speichere die grundlegenden Pokémon-Daten
        await renderPokemonDetails();

    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}

async function renderPokemonDetails() {
    const promises = pokemons.map(async (pokemon) => {
        const response = await fetch(pokemon.url);
        if (!response.ok) {
            throw new Error('Fehler beim Laden der Pokémon-Details');
        }
        return await response.json();
    });

    const allPokemonData = await Promise.all(promises);
    
    const contentRef = document.getElementById('pokeContent');
    contentRef.innerHTML = allPokemonData.map((pokemon, index) => {
        // Hier wird jedem Pokémon eine ID zugewiesen
        return `
            <div class="pokemon-card" onclick='openModal(${index})'>
                ${pokemonDesign(pokemon)}
            </div>
        `;
    }).join('');

    // Speichere die Daten global für den Zugriff im Modal
    pokemons = allPokemonData;
}

function openModal(index) {
    const pokemon = pokemons[index];
    if (pokemon) {
        document.getElementById('modal').style.display = "flex";
        showDetails(pokemon);
    }
}

function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('fading-out');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fading-out');
    }, 600);
}

function showDetails(pokemon) {
    if (pokemon) {
        const modal = document.getElementById('second-modal');
        modal.innerHTML = `
            <h2>${capitalizeFirstLetter(pokemon.name)}</h2>
            <img src="${createPokemonImageUrl(pokemon.id)}" alt="${pokemon.name}">
        `;
    } else {
        console.error("Das Pokemon-Objekt ist nicht definiert.");
    }
}

window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) { 
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});



