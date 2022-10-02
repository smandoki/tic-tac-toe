//handle modal logic
const settingsModal = document.querySelector('#settings-modal');
const resultsModal = document.querySelector('#results-modal');
const resultsModalButton = document.querySelector('#results-button');

function openSettings() {
    settingsModal.showModal();
}

settingsModal.addEventListener('click', (e) => {
    if (e.target === settingsModal) {
        settingsModal.close();
    }
});

resultsModal.addEventListener('click', (e) => {
    if (e.target === resultsModal) {
        resultsModal.close();
    }
});

resultsModalButton.onclick = () => {
    resultsModal.close();
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function changeDifficulty() {
    const form = document.querySelector('#select-difficulty-form');
    const newDifficulty = Number(form.difficulty.value);

    ComputerPlayer.setDifficulty(newDifficulty);
    GameBoard.resetGame();
}


//module for storing board state and game logic
const GameBoard = (() => {
    const gameBoard = ['', '', '', '', '', '', '', '', ''];
    let currentPlayerTurn = false; //false = player, true = CPU
    let computerPlayerTimer;
    let gameEnded = false;

    function makeMove(index) {
        if (gameBoard[index] != '') return;

        const mark = currentPlayerTurn ? 'O' : 'X';
        gameBoard[index] = mark;

        DisplayController.set(index, mark);

        if (gameOver() || gameTied()) {
            gameEnded = true;

            //open result dialog
            if (gameOver()) {
                if (!currentPlayerTurn) {
                    DisplayController.showResult('You Win!');
                } else {
                    DisplayController.showResult('Computer Wins');
                }
            } else {
                DisplayController.showResult('Draw! Game Tied');
            }

            return;
        }

        DisplayController.changeTurn();
        currentPlayerTurn = !currentPlayerTurn;

        if (currentPlayerTurn) {
            computerPlayerTimer = setTimeout(ComputerPlayer.makeMove, 800);
        }
    }

    function gameOver() {
        //check rows
        for (let i = 0; i < 3; i++) {
            let x = 0;
            let o = 0;

            for (let j = 0; j < 3; j++) {
                if (gameBoard[3 * i + j] === 'X') {
                    x++;
                } else if (gameBoard[3 * i + j] === 'O') {
                    o++;
                }
            }

            if (x === 3 || o === 3) {
                return true;
            }
        }

        //check columns
        for (let i = 0; i < 3; i++) {
            let x = 0;
            let o = 0;

            for (let j = 0; j < 3; j++) {
                if (gameBoard[i + 3 * j] === 'X') {
                    x++;
                } else if (gameBoard[i + 3 * j] === 'O') {
                    o++;
                }
            }

            if (x === 3 || o === 3) {
                return true;
            }
        }

        //check diagonals
        if (gameBoard[0] === 'X' && gameBoard[4] === 'X' && gameBoard[8] === 'X') {
            return true;
        }

        if (gameBoard[6] === 'X' && gameBoard[4] === 'X' && gameBoard[2] === 'X') {
            return true;
        }

        if (gameBoard[0] === 'O' && gameBoard[4] === 'O' && gameBoard[8] === 'O') {
            return true;
        }

        if (gameBoard[6] === 'O' && gameBoard[4] === 'O' && gameBoard[2] === 'O') {
            return true;
        }

        return false;
    }

    function gameTied() {
        const emptyCell = gameBoard.indexOf('');
        return emptyCell === -1;
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

        gameEnded = false;
    }

    function getGameStatus() {
        return gameEnded;
    }

    return {
        makeMove,
        getCurrentPlayerTurn,
        getGameBoard,
        resetGame,
        getGameStatus,
    };
})();


//module for functions related to the dom
const DisplayController = (() => {
    const cells = document.querySelectorAll('.cell');
    const players = document.querySelectorAll('.turn-indicator i');
    const resultsMessage = document.querySelector('#results-message');

    cells.forEach(cell => cell.addEventListener('click', e => {
        if (GameBoard.getCurrentPlayerTurn() || GameBoard.getGameStatus()) return;

        const index = e.target.dataset.index;
        GameBoard.makeMove(index);
    }));

    function set(index, mark) {
        cells[index].innerText = mark;
    }

    function changeTurn() {
        players.forEach(player => player.classList.toggle('current-turn'));
    }

    function showResult(result) {
        resultsMessage.innerText = result;
        resultsModal.showModal();
    }

    return {
        set,
        changeTurn,
        showResult,
    };
})();


//module for cpu opponent logic
const ComputerPlayer = (() => {
    let difficulty = 0;
    
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

    function getBestMove() {

    }

    return {
        makeMove,
        setDifficulty,
    };
})();