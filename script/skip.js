function nextPokemon() {
    AUDIO_CLICK.play();
    currentIndex = (currentIndex + 1) % pokemons.length; 
    openModal(currentIndex, false); 
}


function previousPokemon() {
    AUDIO_CLICK.play();
    currentIndex = (currentIndex - 1 + pokemons.length) % pokemons.length; 
    openModal(currentIndex, false); 
}


function showDeveloperAlert() {
    AUDIO_DEVELOP.play();
    alert("Diese Seite wurde entwickelt von René G aus L.");
}