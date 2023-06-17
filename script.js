var board = [];
var tiles = [];

// Function to start the game
function startGame() {
  // Reset the board
  board = Array(4)
    .fill(0)
    .map(() => Array(4).fill(0));

  // Reset the tiles
  tiles = [];

  // Generate two initial tiles
  generateTile();
  generateTile();

  // Update the game board
  updateBoard();
}

// Function to generate a new tile
function generateTile() {
  var tileValue = Math.random() < 0.9 ? 2 : 4;
  var availableSpots = [];

  // Find all available spots on the board
  for (var row = 0; row < 4; row++) {
    for (var column = 0; column < 4; column++) {
      if (board[row][column] === 0) {
        availableSpots.push({ row: row, column: column });
      }
    }
  }

  // Randomly select an available spot
  var spot = availableSpots[Math.floor(Math.random() * availableSpots.length)];

  // Add the new tile to the board
  board[spot.row][spot.column] = tileValue;

  // Create the tile object
  var tile = {
    row: spot.row,
    column: spot.column,
    value: tileValue,
    merged: false,
  };

  // Add the tile to the tiles array
  tiles.push(tile);
}

// Function to handle key events
function handleKey(event) {
  var key = event.key;
  var moved = false;
  switch (key) {
    case "ArrowUp":
      moved = moveUp();
      break;
    case "ArrowDown":
      moved = moveDown();
      break;
    case "ArrowLeft":
      moved = moveLeft();
      break;
    case "ArrowRight":
      moved = moveRight();
      break;
  }

  if (moved) {
    generateTile();
    updateBoard();

    if (isGameWon()) {
      handleGameWin();
    }

    if (isGameOver()) {
      handleGameOver();
    }
  }
}

// Function to move tiles up
function moveUp() {
  var moved = false;

  for (var column = 0; column < 4; column++) {
    for (var row = 1; row < 4; row++) {
      if (board[row][column] !== 0) {
        var newRow = row;
        while (newRow > 0 && board[newRow - 1][column] === 0) {
          board[newRow - 1][column] = board[newRow][column];
          board[newRow][column] = 0;
          newRow--;
          moved = true;
        }
        if (
          newRow > 0 &&
          board[newRow - 1][column] === board[newRow][column] &&
          !tilesMergedInColumn(column, newRow - 1, newRow)
        ) {
          board[newRow - 1][column] *= 2;
          board[newRow][column] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

// Function to move tiles down
function moveDown() {
  var moved = false;

  for (var column = 0; column < 4; column++) {
    for (var row = 2; row >= 0; row--) {
      if (board[row][column] !== 0) {
        var newRow = row;
        while (newRow < 3 && board[newRow + 1][column] === 0) {
          board[newRow + 1][column] = board[newRow][column];
          board[newRow][column] = 0;
          newRow++;
          moved = true;
        }
        if (
          newRow < 3 &&
          board[newRow + 1][column] === board[newRow][column] &&
          !tilesMergedInColumn(column, newRow + 1, newRow)
        ) {
          board[newRow + 1][column] *= 2;
          board[newRow][column] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

// Function to move tiles left
function moveLeft() {
  var moved = false;

  for (var row = 0; row < 4; row++) {
    for (var column = 1; column < 4; column++) {
      if (board[row][column] !== 0) {
        var newColumn = column;
        while (newColumn > 0 && board[row][newColumn - 1] === 0) {
          board[row][newColumn - 1] = board[row][newColumn];
          board[row][newColumn] = 0;
          newColumn--;
          moved = true;
        }
        if (
          newColumn > 0 &&
          board[row][newColumn - 1] === board[row][newColumn] &&
          !tilesMergedInRow(row, newColumn - 1, newColumn)
        ) {
          board[row][newColumn - 1] *= 2;
          board[row][newColumn] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

// Function to move tiles right
function moveRight() {
  var moved = false;

  for (var row = 0; row < 4; row++) {
    for (var column = 2; column >= 0; column--) {
      if (board[row][column] !== 0) {
        var newColumn = column;
        while (newColumn < 3 && board[row][newColumn + 1] === 0) {
          board[row][newColumn + 1] = board[row][newColumn];
          board[row][newColumn] = 0;
          newColumn++;
          moved = true;
        }
        if (
          newColumn < 3 &&
          board[row][newColumn + 1] === board[row][newColumn] &&
          !tilesMergedInRow(row, newColumn + 1, newColumn)
        ) {
          board[row][newColumn + 1] *= 2;
          board[row][newColumn] = 0;
          moved = true;
        }
      }
    }
  }

  return moved;
}

// Function to check if tiles were merged in a column
function tilesMergedInColumn(column, startRow, endRow) {
  for (var row = startRow; row < endRow; row++) {
    if (tiles.some((tile) => tile.column === column && tile.row === row && tile.merged)) {
      return true;
    }
  }
  return false;
}

// Function to check if tiles were merged in a row
function tilesMergedInRow(row, startColumn, endColumn) {
  for (var column = startColumn; column < endColumn; column++) {
    if (tiles.some((tile) => tile.row === row && tile.column === column && tile.merged)) {
      return true;
    }
  }
  return false;
}

// Function to update the game board
function updateBoard() {
  var gameBoard = document.getElementById("game-board");
  gameBoard.innerHTML = "";

  for (var row = 0; row < 4; row++) {
    for (var column = 0; column < 4; column++) {
      var tileValue = board[row][column];

      var tile = document.createElement("div");
      tile.className = "tile tile-" + tileValue;
      tile.textContent = tileValue !== 0 ? tileValue : "";

      gameBoard.appendChild(tile);
    }
  }
}

// Function to check if the game is won
function isGameWon() {
  for (var row = 0; row < 4; row++) {
    for (var column = 0; column < 4; column++) {
      if (board[row][column] === 2048) {
        return true;
      }
    }
  }
  return false;
}

// Function to handle game win
function handleGameWin() {
  alert("Congratulations! You won!");
  startGame();
}

// Function to check if the game is over
function isGameOver() {
  if (tiles.length < 16) {
    return false;
  }

  for (var row = 0; row < 4; row++) {
    for (var column = 0; column < 4; column++) {
      var tileValue = board[row][column];

      if (
        row > 0 && board[row - 1][column] === tileValue ||
        row < 3 && board[row + 1][column] === tileValue ||
        column > 0 && board[row][column - 1] === tileValue ||
        column < 3 && board[row][column + 1] === tileValue
      ) {
        return false;
      }
    }
  }

  return true;
}

// Function to handle game over
function handleGameOver() {
  alert("Game Over! Please try again.");
  startGame();
}

// Function to handle the start button click event
function handleStartButtonClick() {
  startGame();
}

// Add event listener to the start button
var startButton = document.getElementById("start-button");
startButton.addEventListener("click", handleStartButtonClick);

// Add event listener to handle key events
document.addEventListener("keydown", handleKey);

// Start the game
startGame();