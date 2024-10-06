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
    AUDIO_DEVELOP.volume = 0.1; 
    AUDIO_DEVELOP.play().catch(error => {
    });
    
    alert("Diese Seite wurde entwickelt von René G aus L.");  
}