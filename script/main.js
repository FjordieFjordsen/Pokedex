let pokemons = [];        // Enthält die grundlegenden Pokémon-Daten (Name, URL)
let pokemonsURL = [];     // Enthält die URLs zu den detaillierten Daten der Pokémon
let pokemonsDetails = []; // Enthält die detaillierten Daten der Pokémon


async function init() {
    await fetchPokemonData();
    await fetchPokemonDetails(); 
    await renderPokemonDetails();
}


async function fetchPokemonData() {
    try {
        const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=40');
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok.');
        }
        const data = await response.json();
        
        pokemons = data.results; // Speichere die grundlegenden Pokémon-Daten
        pokemonsURL = data.results.map(pokemon => pokemon.url); // Speichere die URLs zu den detaillierten Daten

    } catch (error) {
        console.error('Fehler beim Abrufen der Daten:', error);
    }
}


async function fetchPokemonDetails() {
    try {
        for (let url of pokemonsURL) {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Netzwerkantwort war nicht ok.');
            }
            const details = await response.json();
            pokemonsDetails.push(details); // Speichere die detaillierten Daten in einem separaten Array
        }
    } catch (error) {
        console.error('Fehler beim Abrufen der detaillierten Daten:', error);
    }
}


async function renderPokemonDetails() {
    toggleLoadingSpinner(true);
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
        // Erzeugt direkt die Karte mit pokemonDesign ohne zusätzliches Div
        return pokemonDesign(pokemon);
    }).join('');
    // Speichere die Daten global für den Zugriff im Modal
    pokemons = allPokemonData;
}


function openModal(index) {
    console.log("Index:", index);
    if (index >= 0 && index < pokemons.length) {
    const pokemon = pokemons[index];
    if (pokemon) {
        document.getElementById('modal').style.display = "flex";
        showDetails(pokemon);
    }
    } else {
    console.error("Ungültiger Index für Pokemon:", index);
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
    modal.innerHTML = createPokemonDetailsTemplate(pokemon);

    const moveList = document.getElementById('move-list');
        moveList.innerHTML = `
        <ul>
            ${pokemon.moves.map(move => `<li>${capitalizeFirstLetter(move.move.name)}</li>`).join('')}
        </ul>
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



