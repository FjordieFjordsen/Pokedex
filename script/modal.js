function openModal() {
    console.log("Das Modal wurde geöffnet!");
    document.getElementById('modal').style.display = "flex";
}


function closeModal() {
    const modal = document.getElementById('modal');
    modal.classList.add('fading-out');
    setTimeout(() => {
        modal.style.display = 'none';
        modal.classList.remove('fading-out');
    }, 600);
}


