export const ROWS = 6;
export const COLS = 7;

export function getValidMoves(board) {
    return [...Array(COLS).keys()].filter(c => !board[0][c]);
}

export function cloneBoard(board) {
    return board.map(row => [...row]);
}

export function dropPiece(board, col, player) {
    for (let r = ROWS - 1; r >= 0; r--) {
        if (!board[r][col]) {
            board[r][col] = player;
            return r;
        }
    }
    return null;
}

export function isWinningMove(board, player) {
    for (let r = 0; r < ROWS; r++)
        for (let c = 0; c < COLS - 3; c++)
            if ([board[r][c], board[r][c+1], board[r][c+2], board[r][c+3]].every(x => x === player)) return true;

    for (let c = 0; c < COLS; c++)
        for (let r = 0; r < ROWS - 3; r++)
            if ([board[r][c], board[r+1][c], board[r+2][c], board[r+3][c]].every(x => x === player)) return true;

    for (let r = 0; r < ROWS - 3; r++)
        for (let c = 0; c < COLS - 3; c++)
            if ([board[r][c], board[r+1][c+1], board[r+2][c+2], board[r+3][c+3]].every(x => x === player)) return true;

    for (let r = 3; r < ROWS; r++)
        for (let c = 0; c < COLS - 3; c++)
            if ([board[r][c], board[r-1][c+1], board[r-2][c+2], board[r-3][c+3]].every(x => x === player)) return true;

    return false;
}

export function minimax(board, depth, alpha, beta, maximizingPlayer, aiPlayer, humanPlayer) {
    const validMoves = getValidMoves(board);
    const terminal = isWinningMove(board, aiPlayer) || isWinningMove(board, humanPlayer) || validMoves.length === 0;

    if (depth === 0 || terminal) {
        if (isWinningMove(board, aiPlayer)) return { score: 10000 };
        if (isWinningMove(board, humanPlayer)) return { score: -10000 };
        return { score: 0 };
    }

    if (maximizingPlayer) {
        let maxScore = -Infinity;
        let bestCol = validMoves[0];

        for (let col of validMoves) {
            const temp = cloneBoard(board);
            dropPiece(temp, col, aiPlayer);
            const score = minimax(temp, depth - 1, alpha, beta, false, aiPlayer, humanPlayer).score;

            if (score > maxScore) {
                maxScore = score;
                bestCol = col;
            }

            alpha = Math.max(alpha, score);
            if (beta <= alpha) break;
        }

        return { col: bestCol, score: maxScore };

    } else {

        let minScore = Infinity;
        let bestCol = validMoves[0];

        for (let col of validMoves) {
            const temp = cloneBoard(board);
            dropPiece(temp, col, humanPlayer);
            const score = minimax(temp, depth - 1, alpha, beta, true, aiPlayer, humanPlayer).score;

            if (score < minScore) {
                minScore = score;
                bestCol = col;
            }

            beta = Math.min(beta, score);
            if (beta <= alpha) break;
        }

        return { col: bestCol, score: minScore };
    }
}