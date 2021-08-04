window.addEventListener('load', setFunctions, false);
const squares = document.getElementsByClassName('square');

function setFunctions() {
  for (let i = 0; i < squares.length; i++) {
    squares[i].addEventListener('click', game.addXorO, false);
  }
  document.getElementById('reset').addEventListener('click', reset.resetGame, false);
  document.getElementById('btn-x-name').addEventListener('click', function () {
    const xName = document.getElementById('text-x-name').value;
    document.getElementById('x-name').textContent = `[${xName}]`;
  });
  document.getElementById('btn-o-name').addEventListener('click', function () {
    const oName = document.getElementById('text-o-name').value;
    document.getElementById('o-name').textContent = `[${oName}]`;
  });
  player.updatePlayer();
  player.updateWinCount();
}

let player = {
  playerX: 'X',
  playerO: 'O',
  winner: false,
  updatePlayer: function () {
    let addText = player.winner ? 'You have won player: ' + gameStats.winningPlayer + '!!!' : "It's your turn player: " + game.whosTurn;
    document.getElementById('player').textContent = addText;
  },
  updateWinCount: function () {
    document.getElementById('wins-for-X').textContent = gameStats.winCountForX;
    document.getElementById('wins-for-O').textContent = gameStats.winCountForO;
  },
};

let game = {
  whosTurn: player.playerX,
  addXorO: function (e) {
    if (e.target.innerText === '' && !player.winner) {
      game.updateGrid(game.whosTurn, e.target.id);
      document.getElementById(e.target.id).textContent = game.whosTurn;
      game.whosTurn = game.whosTurn === player.playerX && !player.winner ? player.playerO : player.playerX;
      player.updatePlayer();
    }
  },
  gridO: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  gridX: [
    [0, 0, 0],
    [0, 0, 0],
    [0, 0, 0],
  ],
  updateGrid: function (playerXorO, square) {
    let grid = playerXorO === 'X' ? game.gridX : game.gridO;
    let [row, col] = [Math.floor(square / 3), square % 3];
    grid[row][col] = 1;
    if (gameStats.checkWinner(grid)) {
      player.winner = true;
      gameStats.winningPlayer = playerXorO;
      gameStats.winCountForO = gameStats.winningPlayer === 'O' ? gameStats.winCountForO + 1 : gameStats.winCountForO;
      gameStats.winCountForX = gameStats.winningPlayer === 'X' ? gameStats.winCountForX + 1 : gameStats.winCountForX;
      player.updateWinCount();
    }
  },
};

let gameStats = {
  winningPlayer: null,
  winCountForX: 0,
  winCountForO: 0,
  checkWinner: function (grid) {
    let [colSum, rowSum, majorDiagonalSum, minorDiagonalSum] = [0, 0, 0, 0];
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        colSum += grid[j][i];
        rowSum += grid[i][j];
        if (i === j) {
          majorDiagonalSum += grid[i][j];
          if (i === 0) {
            minorDiagonalSum += grid[i][j + 2];
          } else if (j === 2) {
            minorDiagonalSum += grid[i][j - 2];
          } else {
            minorDiagonalSum += grid[i][j];
          }
        }
      }
      if (colSum === 3 || rowSum === 3 || majorDiagonalSum === 3 || minorDiagonalSum === 3) {
        return true;
      }
      [colSum, rowSum] = [0, 0];
    }
  },
};

let reset = {
  resetGame: function () {
    game.whosTurn = player.winner && gameStats.winningPlayer === 'X' ? player.playerO : player.winner && gameStats.winningPlayer === 'O' ? player.playerX : player.playerX;
    player.winner = false;
    player.updatePlayer();
    for (let i = 0; i < squares.length; i++) {
      squares[i].textContent = '';
    }
    reset.clearGrid(game.gridO);
    reset.clearGrid(game.gridX);
  },
  clearGrid: function (grid) {
    for (let i = 0; i < grid.length; i++) {
      for (let j = 0; j < grid[i].length; j++) {
        grid[i][j] = 0;
      }
    }
  },
};
