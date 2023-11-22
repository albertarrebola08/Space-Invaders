document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const rows = prompt('Ingrese el número de filas:');
  const columns = prompt('Ingrese el número de columnas:');

  const cellSize = 30;
  canvas.width = columns * cellSize;
  canvas.height = rows * cellSize;

  const gameBoard = createGameBoard(rows, columns);
  let pacmanRow = 0;
  let pacmanColumn = 0;

  const ghosts = [];

  drawGameBoard(ctx, gameBoard, cellSize);
  drawElement(ctx, pacmanRow, pacmanColumn, 'pacman', cellSize);

  for (let i = 0; i < 4; i++) {
    const randomRow = Math.floor(Math.random() * rows);
    const randomColumn = Math.floor(Math.random() * columns);
    ghosts.push({ row: randomRow, column: randomColumn });
    drawElement(ctx, randomRow, randomColumn, 'ghost', cellSize);
  }

  // Mover los fantasmas en intervalos regulares
  setInterval(moveGhosts, 200);

  function moveGhosts() {
    for (let i = 0; i < ghosts.length; i++) {
      // Verificar si el fantasma ha alcanzado el límite de pasos
      if (ghosts[i].stepsRemaining === 0) {
        // Generar un nuevo objetivo aleatorio
        ghosts[i].targetRow = Math.floor(Math.random() * rows);
        ghosts[i].targetColumn = Math.floor(Math.random() * columns);

        // Calcular la dirección hacia el objetivo
        const rowDifference = ghosts[i].targetRow - ghosts[i].row;
        const columnDifference = ghosts[i].targetColumn - ghosts[i].column;

        // Determinar la dirección predominante
        if (Math.abs(rowDifference) > Math.abs(columnDifference)) {
          ghosts[i].verticalMovement = rowDifference > 0 ? 1 : -1;
          ghosts[i].horizontalMovement = 0;
        } else {
          ghosts[i].verticalMovement = 0;
          ghosts[i].horizontalMovement = columnDifference > 0 ? 1 : -1;
        }

        // Establecer un nuevo límite de pas20os
        ghosts[i].stepsRemaining = Math.floor(Math.random() * (20 - 5 + 1)) + 5;;
      }

      // Calcular la nueva posición del fantasma
      const newGhostRow = ghosts[i].row + ghosts[i].verticalMovement;
      const newGhostColumn = ghosts[i].column + ghosts[i].horizontalMovement;

      // Verificar si la nueva posición está dentro del tablero y es una celda vacía
      if (
        newGhostRow >= 0 &&
        newGhostRow < rows &&
        newGhostColumn >= 0 &&
        newGhostColumn < columns &&
        gameBoard[newGhostRow][newGhostColumn] === 'empty'
      ) {
        // Limpiar la posición anterior del fantasma
        drawElement(ctx, ghosts[i].row, ghosts[i].column, 'empty', cellSize);

        // Actualizar la posición del fantasma
        ghosts[i].row = newGhostRow;
        ghosts[i].column = newGhostColumn;

        // Dibujar el fantasma en la nueva posición
        drawElement(ctx, newGhostRow, newGhostColumn, 'ghost', cellSize);

        // Reducir el contador de pasos restantes
        ghosts[i].stepsRemaining--;
      } else {
        // Si la nueva posición no es válida, reducir el límite de pasos para cambiar de dirección
        ghosts[i].stepsRemaining = 0;
      }
    }
  }
  
  document.addEventListener('keydown', function (event) {
    let moved = false;

    switch (event.key) {
      case 'ArrowUp':
        moved = movePacman('up');
        break;
      case 'ArrowDown':
        moved = movePacman('down');
        break;
      case 'ArrowLeft':
        moved = movePacman('left');
        break;
      case 'ArrowRight':
        moved = movePacman('right');
        break;
    }
      // Verificar si el Pacman se choca con un fantasma
      if (checkCollisionWithGhosts()) {
        alert('Game Over. ¡Te chocaste con un fantasma!');
        resetGame();
        return;
    }
    if (moved) {
      // Pintar la celda de color naranja solo si está vacía
      if (gameBoard[pacmanRow][pacmanColumn] === 'empty') {
        gameBoard[pacmanRow][pacmanColumn] = 'orange';
      }

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      drawGameBoard(ctx, gameBoard, cellSize);
      drawElement(ctx, pacmanRow, pacmanColumn, 'pacman', cellSize);

      for (const ghost of ghosts) {
        drawElement(ctx, ghost.row, ghost.column, 'ghost', cellSize);
      }
    }
  });


  function checkCollisionWithGhosts() {
    for (const ghost of ghosts) {
        if (pacmanRow === ghost.row && pacmanColumn === ghost.column) {
            return true; // Hay colisión
        }
    }
    return false; // No hay colisión
}

  function movePacman(direction) {
    let newPacmanRow = pacmanRow;
    let newPacmanColumn = pacmanColumn;

    switch (direction) {
      case 'up':
        if (pacmanRow > 0) newPacmanRow--;
        break;
      case 'down':
        if (pacmanRow < rows - 1) newPacmanRow++;
        break;
      case 'left':
        if (pacmanColumn > 0) newPacmanColumn--;
        break;
      case 'right':
        if (pacmanColumn < columns - 1) newPacmanColumn++;
        break;
    }

    pacmanRow = newPacmanRow;
    pacmanColumn = newPacmanColumn;

    return true;
  }
});

function createGameBoard(rows, columns) {
  const gameBoard = [];
  for (let i = 0; i < rows; i++) {
    const row = [];
    for (let j = 0; j < columns; j++) {
      row.push('empty');
    }
    gameBoard.push(row);
  }
  return gameBoard;
}

function drawGameBoard(ctx, gameBoard, cellSize) {
  for (let i = 0; i < gameBoard.length; i++) {
    for (let j = 0; j < gameBoard[i].length; j++) {
      const x = j * cellSize;
      const y = i * cellSize;
      ctx.fillStyle = getColor(gameBoard[i][j]);
      ctx.fillRect(x, y, cellSize, cellSize);
      ctx.strokeRect(x, y, cellSize, cellSize);
    }
  }
}

function drawElement(ctx, row, column, element, cellSize) {
  const x = column * cellSize;
  const y = row * cellSize;

  switch (element) {
    case 'pacman':
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.lineTo(x + cellSize / 2, y + cellSize / 2);
      ctx.closePath();
      ctx.fill();
      break;
      case 'ghost':
        const ghostImage = new Image();
        ghostImage.src = 'ghost.png'; // Reemplaza con la ruta correcta de tu imagen
        ctx.drawImage(ghostImage, x, y, cellSize, cellSize);
      break;
    case 'empty':
      ctx.clearRect(x, y, cellSize, cellSize);
      break;
  }
}

function getColor(cell) {
  switch (cell) {
    case 'empty':
      return '#ffffff';
    case 'orange':
      return '#ff9800';
    default:
      return '#ffffff';
  }
}
