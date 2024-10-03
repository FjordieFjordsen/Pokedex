let searchTimeout;


function validateSearchTerm(searchTerm) {
    if (searchTerm.length < 3) {
        document.getElementById('results').innerHTML = '';
        return false;
    }
    return true;
}


async function fetchAllPokemon() {
    const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=151');
    const data = await response.json();
    return data.results;
}


function filterPokemon(allPokemon, searchTerm) {
    return allPokemon.filter(pokemon => pokemon.name.toLowerCase().startsWith(searchTerm.toLowerCase()));
}


async function displayFilteredPokemon(filteredPokemon) {
    const resultsList = document.getElementById('results');
    resultsList.innerHTML = '';
    showOverlay(filteredPokemon.length > 0);
    
    for (const pokemon of filteredPokemon) {
        const detailsResponse = await fetch(pokemon.url);
        const details = await detailsResponse.json();
        const cardHtml = pokemonDesign(details);
        resultsList.innerHTML += cardHtml;
    }
    document.getElementById('searchInput').value = '';
    document.getElementById('searchInput').addEventListener('keydown', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault();  
        }
    });
}


async function searchPokemon() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    if (!validateSearchTerm(searchTerm)) return;
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(async () => {
        try {
            const allPokemon = await fetchAllPokemon();
            const filteredPokemon = filterPokemon(allPokemon, searchTerm);
            await displayFilteredPokemon(filteredPokemon);
        } catch (error) {
            console.error('Fehler bei der Suche:', error);
            document.getElementById('results').innerHTML = '<li>Pokémon nicht gefunden!</li>';
        }
    }, 400);
}


function showOverlay(show) {
    const overlay = document.getElementById('overlay');
    overlay.style.display = show ? 'block' : 'none';
}


function closeOverlay() {
    document.getElementById('overlay').style.display = 'none';
}