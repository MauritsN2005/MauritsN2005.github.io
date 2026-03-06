import { ROWS, COLS, getValidMoves, dropPiece, isWinningMove, minimax } from './ai.js';

const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const boardEl = document.getElementById('board');
const statusEl = document.getElementById('status');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const backBtn = document.getElementById('back-btn');
const aiToggleStart = document.getElementById('toggle-ai');
const aiToggleGame = document.getElementById('ai-toggle-game');
const winScreen = document.getElementById('win-screen');
const winText = document.getElementById('win-text');
const winRestart = document.getElementById('win-restart');
const winBack = document.getElementById('win-back');

const dropSound = document.getElementById('drop-sound');
const winSound = document.getElementById('win-sound');
const loseSound = document.getElementById('lose-sound');
const clickSound = document.getElementById('click-sound');

let board;
let currentPlayer;
let aiEnabled;
let gameOver;
let lastMoveRow;
let lastMoveCol;

function play(sound) {
    if (!sound) return;
    sound.currentTime = 0;
    sound.play().catch(() => {});
}

startBtn.onclick = () => {
    play(clickSound);
    aiEnabled = aiToggleStart.checked;
    aiToggleGame.checked = aiEnabled;
    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    resetGame();
};

restartBtn.onclick = () => { play(clickSound); resetGame(); };
backBtn.onclick = () => {
    play(clickSound);
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
};
winRestart.onclick = () => { play(clickSound); winScreen.style.display='none'; resetGame(); };
winBack.onclick = () => {
    play(clickSound);
    winScreen.style.display='none';
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
};

aiToggleGame.onchange = () => {
    aiEnabled = aiToggleGame.checked;

    if (aiEnabled && !gameOver && currentPlayer === 'yellow') {
        statusEl.textContent = 'AI speelt...';
        setTimeout(aiMove, 400);
    }

    if (!aiEnabled && !gameOver) {
        statusEl.textContent =
            currentPlayer === 'red'
                ? 'Rood is aan de beurt'
                : 'Geel is aan de beurt';
    }
};

function renderBoard() {
    boardEl.innerHTML = '';

    for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');

            if (board[r][c]) cell.classList.add(board[r][c]);

            if (r === lastMoveRow && c === lastMoveCol) {
                cell.classList.add('falling');
            }

            if (!gameOver) {
                cell.addEventListener('click', () => handleClick(c));
            }

            boardEl.appendChild(cell);
        }
    }
}

function handleClick(col) {
    if (gameOver) return;
    if (!getValidMoves(board).includes(col)) return;

    lastMoveRow = dropPiece(board, col, currentPlayer);
    lastMoveCol = col;

    play(dropSound);
    renderBoard();

    if (isWinningMove(board, currentPlayer)) {
        handleWin(currentPlayer);
        return;
    }

    if (aiEnabled && currentPlayer === 'red') {
        currentPlayer = 'yellow';
        statusEl.textContent = 'AI speelt...';
        setTimeout(aiMove, 400);
    } else {
        currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';

        if (aiEnabled) {
            statusEl.textContent = 'Jouw beurt';
        } else {
            statusEl.textContent =
                currentPlayer === 'red'
                    ? 'Rood is aan de beurt'
                    : 'Geel is aan de beurt';
        }
    }
}

function aiMove() {
    if (gameOver) return;

    const result = minimax(board, 3, -Infinity, Infinity, true, 'yellow', 'red');

    if (result.col !== undefined) {
        lastMoveRow = dropPiece(board, result.col, 'yellow');
        lastMoveCol = result.col;

        play(dropSound);
        renderBoard();

        if (isWinningMove(board, 'yellow')) {
            handleWin('yellow');
            return;
        }
    }

    currentPlayer = 'red';
    statusEl.textContent = 'Jouw beurt';
}

function handleWin(player) {
    gameOver = true;

    if (aiEnabled) {
        if (player === 'red') {
            play(winSound);
            winText.textContent = 'Jij wint!';
        } else {
            play(loseSound);
            winText.textContent = 'AI wint!';
        }
    } else {
        play(winSound);
        winText.textContent =
            player === 'red'
                ? 'Rood wint!'
                : 'Geel wint!';
    }

    winScreen.style.display = 'flex';
}

function resetGame() {
    board = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    currentPlayer = 'red';
    gameOver = false;
    lastMoveRow = null;
    lastMoveCol = null;

    renderBoard();

    if (aiEnabled) {
        statusEl.textContent = 'Jouw beurt';
    } else {
        statusEl.textContent = 'Rood is aan de beurt';
    }

    winScreen.style.display = 'none';
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('./sw.js');
}