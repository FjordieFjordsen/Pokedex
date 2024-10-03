function toggleLoadingSpinner(show) {
    const loadingSpinner = document.querySelector('.loading');
    if (!loadingSpinner) {
        return; 
    }
    loadingSpinner.style.display = show ? 'block' : 'none';
}


function playAudio() {
    const audio = new Audio('audio/home.mp3');
    audio.play();
}
