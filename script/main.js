let pokemons = []; 
let currentOffset = 0; 
const LIMIT = 25; 
const AUDIO_LOADING = new Audio('audio/hello.mp3');
const AUDIO_CLOSE = new Audio('audio/close.mp3');
const AUDIO_CLICK = new Audio('audio/click.mp3');
const AUDIO_DEVELOP = new Audio('audio/develop.mp3');
const AUDIO_HOME = new Audio('audio/home.mp3');


async function init() {
    toggleLoadingSpinner(true); 
    const basicPokemonData = await fetchBasicPokemonData(currentOffset, LIMIT);
    if (basicPokemonData && basicPokemonData.length > 0) {
        const detailedPokemonData = await fetchPokemonDetails(basicPokemonData);
        pokemons = pokemons.concat(detailedPokemonData);
        renderPokemonDetails();
    } else {
        console.log('Keine Pokémon gefunden!');
    }
    toggleLoadingSpinner(false); 
}


async function loadMorePokemon() {
    toggleLoadingSpinner(true); 
    currentOffset += LIMIT; 
    const basicPokemonData = await fetchBasicPokemonData(currentOffset, LIMIT); 
    if (basicPokemonData && basicPokemonData.length > 0) {
        const detailedPokemonData = await fetchPokemonDetails(basicPokemonData); 
        pokemons = pokemons.concat(detailedPokemonData); 
        renderPokemonDetails(); 
    } else {
        console.log('Keine weiteren Pokémon gefunden!'); 
    }
    toggleLoadingSpinner(false); 
}


async function fetchBasicPokemonData(offset, limit) {
    const url = `https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`; 
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Netzwerkantwort war nicht ok.');
        }
        const data = await response.json(); 
        return data.results; 
    } catch (error) {
        console.error('Fehler beim Abrufen der Basisdaten von der Pokémon API:', error); 
        return []; 
    }
}


async function fetchPokemonDetails(pokemonList) {
    try {
        const pokemonDetailsPromises = pokemonList.map(async (pokemon) => {
            const pokemonResponse = await fetch(pokemon.url);
            if (!pokemonResponse.ok) {
                throw new Error('Fehler beim Laden der Pokémon-Details');
            }
            return await pokemonResponse.json();
        });
        const allPokemonDetails = await Promise.all(pokemonDetailsPromises);
        return allPokemonDetails; 
    } catch (error) {
        console.error('Fehler beim Abrufen der detaillierten Daten:', error); 
        return []; 
    }
}


function renderPokemonDetails() {
    toggleLoadingSpinner(true); 

    const contentRef = document.getElementById('pokeContent');
    contentRef.innerHTML = ''; 
    contentRef.innerHTML = pokemons.map((pokemon) => pokemonDesign(pokemon)).join('');
    
    toggleLoadingSpinner(false); 
}


function playLoadingSound() {
    AUDIO_LOADING.volume = 0.1;
    AUDIO_LOADING.play();
}


function openModal(index, playSound = true) {
    if (index >= 0 && index < pokemons.length) {
        if (playSound) {
            playLoadingSound(); // Ton abspielen
        }
        const pokemon = pokemons[index];
        if (pokemon) {
            currentIndex = index; 
            document.getElementById('modal').style.display = "flex";
            document.body.style.overflow = "hidden"; 
            showDetails(pokemon);
            document.getElementById('searchInput').value = '';
            setActiveTabStyle();
        }
    } else {
        AUDIO_CLICK.play();
        alert("Die Datenbank stellt leider im Moment keine Informationen bereit. Versuch bitte einen anderen Pokefreund.");
    }
}


function setActiveTabStyle() {
    const attacksButton = document.getElementById('attacksTabButton');
    attacksButton.style.outline = '1px solid white'; 
    
    const developmentButton = document.getElementById('developmentTabButton');
    developmentButton.style.outline = 'none'; 
}


function closeModal() {
    AUDIO_LOADING.volume = 0.1;
    AUDIO_LOADING.play();
    const modal = document.getElementById('modal');
    modal.classList.add('fading-out');
    
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fading-out');
        document.body.style.overflow = "auto"; 
    }, 600); 
}


function showDetails(pokemon) {
    if (pokemon) {
        const modal = document.getElementById('second-modal');
        if (!modal) {
            console.error("Das Modal-Element konnte nicht gefunden werden.");
            return;
        }
        modal.innerHTML = createPokemonDetailsTemplate(pokemon);
        renderMoveList(pokemon);
    } else {
        console.error("Das Pokemon-Objekt ist nicht definiert.");
    }
}


function renderMoveList(pokemon) {
    const moveList = document.getElementById('move-list');
    if (!moveList) {
        return;
    }
    if (pokemon.moves && pokemon.moves.length > 0) {
        moveList.innerHTML = `
        <ul>
            ${pokemon.moves.map(move => `<li>${capitalizeFirstLetter(move.move.name)}</li>`).join('')}
        </ul>
        `;
    } else {
        moveList.innerHTML = '<p>Keine Moves verfügbar</p>';
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