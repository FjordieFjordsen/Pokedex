function toggleLoadingSpinner(show) {
    const loadingSpinner = document.querySelector('.load-more-container .loading');
    if (!loadingSpinner) {
        console.error('Loading spinner not found in the DOM.');
        return; 
    }
    loadingSpinner.style.display = show ? 'block' : 'none'; 
    console.log(`Loading spinner is now ${show ? 'visible' : 'hidden'}.`);
}


function playAudio() {
    const AUDIO_HOME = new Audio('audio/home.mp3');  
    AUDIO_HOME.volume = 0.1;  
    AUDIO_HOME.play();  
}
