//handle modal logic
const settingsModal = document.querySelector('#settings-modal');

function openSettings() {
    settingsModal.showModal();
}

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.close();
    }
});

function resetGame() {

}


//module for storing board state and game logic
const GameBoard = (() => {
    const gameBoard = ['', '', '', '', '', '', '', '', ''];
    let currentPlayerTurn = false; //false = player, true = CPU

    function makeMove(index) {
        if (gameBoard[index] != '') return;

        const mark = currentPlayerTurn ? 'O' : 'X';
        gameBoard[index] = mark;

        DisplayController.set(index, mark);
        DisplayController.changeTurn();

        currentPlayerTurn = !currentPlayerTurn;
    }

    function getCurrentPlayerTurn() {
        return currentPlayerTurn;
    }

    return {
        makeMove,
        getCurrentPlayerTurn,
    };
})();


//module for functions related to the dom
const DisplayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const players = document.querySelectorAll('.turn-indicator i');

    cells.forEach(cell => cell.addEventListener('click', e => {
        if (GameBoard.getCurrentPlayerTurn()) return;

        const index = e.target.dataset.index;
        GameBoard.makeMove(index);
    }));

    function set(index, mark) {
        cells[index].innerText = mark;
    }

    function changeTurn() {
        players.forEach(player => player.classList.toggle('current-turn'));
    }

    return {
        set,
        changeTurn,
    };
})();


//module for cpu opponent logic
const ComputerPlayer = (() => {
    const difficulty = 0;

    function makeMove() {
        const move = difficulty === 0 ? getRandomMove() : getBestMove();
    }

    function getRandomMove() {

    }
})();