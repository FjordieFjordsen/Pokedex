let pokemons = [];


async function init() {
    try {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=40');
    if (!response.ok) {
        throw new Error('Netzwerkantwort war nicht ok.');
    }
    const data = await response.json();

    pokemons = data.results; // Speichere nur die Pokémon-Objekte

    await renderPokemon();
    } catch (error) {
    console.error('Fehler beim Abrufen der Daten:', error);
    }
}


async function renderPokemon() {
    const contentRef = document.getElementById('pokeContent');
    contentRef.innerHTML = ''; // Leere den Container vor dem Rendern

for (let i = 0; i < pokemons.length; i++) {
    const pokemonUrl = pokemons[i].url; // URL für detaillierte Infos
    const pokemonData = await fetchPokemonDetails(pokemonUrl);
    const cardHTML = pokemonDesign(pokemonData, i);
    contentRef.innerHTML += cardHTML;
    }
}


async function fetchPokemonDetails(url) {
    const response = await fetch(url);
    if (!response.ok) {
    throw new Error('Fehler beim Laden der Pokémon-Details');
    }
    return await response.json();
}


window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 50) { 
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});


function openModal(pokemonId) {
    const modal = document.getElementById('modal');
    modal.innerHTML = `
      <div class="modal-content">
        <h2>Hallo</h2>
        <p>Weitere Informationen zum Pokémon folgen hier...</p>
      </div>
    `;
    modal.style.display = 'block';
  }



