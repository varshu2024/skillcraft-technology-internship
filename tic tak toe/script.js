class TicTacToe {
    constructor() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.gameMode = null; // 'twoPlayer' or 'vsComputer'
        this.winningCombination = null;
        this.initializeGame();
    }

    initializeGame() {
        this.board = Array(9).fill(null);
        this.currentPlayer = 'X';
        this.gameActive = true;
        this.winningCombination = null;
        this.updateStatus();
        this.renderBoard();
        
        // Set up event listeners
        document.querySelectorAll('.cell').forEach(cell => {
            cell.addEventListener('click', this.handleCellClick.bind(this));
        });
        
        document.getElementById('twoPlayer').addEventListener('click', () => {
            this.gameMode = 'twoPlayer';
            this.initializeGame();
        });
        
        document.getElementById('vsComputer').addEventListener('click', () => {
            this.gameMode = 'vsComputer';
            this.initializeGame();
        });
        
        document.getElementById('restart').addEventListener('click', () => {
            this.initializeGame();
        });
    }

    handleCellClick(e) {
        const index = parseInt(e.target.getAttribute('data-index'));
        
        if (!this.gameActive || this.board[index] !== null) return;
        
        this.makeMove(index);
        
        // Computer's turn in vsComputer mode
        if (this.gameActive && this.gameMode === 'vsComputer' && this.currentPlayer === 'O') {
            setTimeout(() => this.computerMove(), 500);
        }
    }

    makeMove(index) {
        this.board[index] = this.currentPlayer;
        this.checkResult();
        if (this.gameActive) {
            this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
            this.updateStatus();
        }
        this.renderBoard();
    }

    computerMove() {
        if (!this.gameActive) return;
        
        // Simple AI: first try to win, then block, then random move
        let move = this.findWinningMove('O') || 
                   this.findWinningMove('X') || 
                   this.findRandomMove();
        
        if (move !== null) {
            this.makeMove(move);
        }
    }

    findWinningMove(player) {
        for (let i = 0; i < 9; i++) {
            if (this.board[i] === null) {
                this.board[i] = player;
                const isWin = this.checkWin(false);
                this.board[i] = null;
                if (isWin) return i;
            }
        }
        return null;
    }

    findRandomMove() {
        const availableMoves = this.board
            .map((cell, index) => cell === null ? index : null)
            .filter(val => val !== null);
        
        if (availableMoves.length > 0) {
            return availableMoves[Math.floor(Math.random() * availableMoves.length)];
        }
        return null;
    }

    checkResult() {
        const win = this.checkWin(true);
        if (win) {
            this.gameActive = false;
            document.getElementById('status').textContent = `Player ${this.currentPlayer} wins!`;
            return;
        }
        
        if (this.board.every(cell => cell !== null)) {
            this.gameActive = false;
            document.getElementById('status').textContent = "Game ended in a draw!";
        }
    }

    checkWin(updateWinningCombo) {
        const winningCombinations = [
            [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
            [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
            [0, 4, 8], [2, 4, 6]             // diagonals
        ];

        for (const combination of winningCombinations) {
            const [a, b, c] = combination;
            if (this.board[a] && 
                this.board[a] === this.board[b] && 
                this.board[a] === this.board[c]) {
                if (updateWinningCombo) {
                    this.winningCombination = combination;
                }
                return true;
            }
        }
        return false;
    }

    updateStatus() {
        if (this.gameActive) {
            const playerText = this.gameMode === 'vsComputer' && this.currentPlayer === 'O' 
                ? "Computer's turn" 
                : `Player ${this.currentPlayer}'s turn`;
            document.getElementById('status').textContent = playerText;
        }
    }

    renderBoard() {
        document.querySelectorAll('.cell').forEach((cell, index) => {
            cell.textContent = this.board[index];
            cell.className = 'cell';
            if (this.board[index]) {
                cell.classList.add(this.board[index].toLowerCase());
            }
            if (this.winningCombination && this.winningCombination.includes(index)) {
                cell.classList.add('winning-cell');
            }
        });
    }
}

// Initialize the game when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new TicTacToe();
});