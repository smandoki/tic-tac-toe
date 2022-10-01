const settingsModal = document.querySelector('#select-difficulty-modal');

function openSettings() {
    settingsModal.showModal();
}

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.close();
    }
});