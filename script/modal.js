function toggleLoadingSpinner(show) {
    const loadingSpinner = document.querySelector('.loading');
    if (show) {
    loadingSpinner.style.display = 'block';
    } else {
    loadingSpinner.style.display = 'none';
    }
}


// Vor dem Laden der Daten:
toggleLoadingSpinner(true); // Spinner anzeigen

// Nach erfolgreichem Laden der Daten:
toggleLoadingSpinner(false); // Spinner ausblenden


const container = document.querySelector('.list');

container.addEventListener('scroll', () => {
if (container.scrollTop + container.clientHeight >= container.scrollHeight) {
    // Benutzer ist am Ende angekommen
    // Hier kannst du weitere Aktionen ausführen, z.B. ein Modal öffnen
}
});





