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

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeDifficulty() {
    const form = document.querySelector('.select-difficulty-form');
    const newDifficulty = Number(form.difficulty.value);

    ComputerPlayer.setDifficulty(newDifficulty);
    GameBoard.resetGame();
}


//module for storing board state and game logic
const GameBoard = (() => {
    const gameBoard = ['', '', '', '', '', '', '', '', ''];
    let currentPlayerTurn = false; //false = player, true = CPU
    let computerPlayerTimer;

    function makeMove(index) {
        if (gameBoard[index] != '') return;

        const mark = currentPlayerTurn ? 'O' : 'X';
        gameBoard[index] = mark;

        DisplayController.set(index, mark);

        if (gameOver()) { //checks for win/draw/loss
            
        }

        DisplayController.changeTurn();
        currentPlayerTurn = !currentPlayerTurn;

        if (currentPlayerTurn) {
            computerPlayerTimer = setTimeout(ComputerPlayer.makeMove, 800);
        }
    }

    function gameOver() {
        return false;
    }

    function getCurrentPlayerTurn() {
        return currentPlayerTurn;
    }

    function getGameBoard() {
        //returning shallow copy so that board cannot be modified from outside
        return [...gameBoard];
    }

    function resetGame() {
        for (let i = 0; i < gameBoard.length; i++) {
            gameBoard[i] = '';
            DisplayController.set(i, '');
        }

        clearTimeout(computerPlayerTimer);
        
        if (currentPlayerTurn) {
            currentPlayerTurn = false;
            DisplayController.changeTurn();
        }
    }

    return {
        makeMove,
        getCurrentPlayerTurn,
        getGameBoard,
        resetGame,
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
        GameBoard.makeMove(move);
    }

    function getRandomMove() {
        const possibleMoves = [];
        const gameBoard = GameBoard.getGameBoard();

        for (let i = 0; i < gameBoard.length; i++) {
            if (gameBoard[i] === '') {
                possibleMoves.push(i);
            }
        }

        return possibleMoves[getRandomInt(0, possibleMoves.length - 1)];
    }

    function setDifficulty(newDifficulty) {
        difficulty = newDifficulty;
    }

    return {
        makeMove,
        setDifficulty,
    };
})();