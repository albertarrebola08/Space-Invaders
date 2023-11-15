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
    setInterval(moveGhosts, 500);
  
    function moveGhosts() {
      for (let i = 0; i < ghosts.length; i++) {
        // Generar un número aleatorio entre -1 y 1 para determinar el movimiento en fila y columna
        const randomRowMove = Math.floor(Math.random() * 3) - 1;
        const randomColumnMove = Math.floor(Math.random() * 3) - 1;
  
        const newGhostRow = ghosts[i].row + randomRowMove;
        const newGhostColumn = ghosts[i].column + randomColumnMove;
  
        // Verificar si la nueva posición está dentro del tablero
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
  
      if (moved) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameBoard(ctx, gameBoard, cellSize);
        drawElement(ctx, pacmanRow, pacmanColumn, 'pacman', cellSize);
  
        for (const ghost of ghosts) {
          drawElement(ctx, ghost.row, ghost.column, 'ghost', cellSize);
        }
      }
    });
  
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
  
      if (gameBoard[newPacmanRow][newPacmanColumn] === 'empty') {
        pacmanRow = newPacmanRow;
        pacmanColumn = newPacmanColumn;
        return true;
      }
  
      return false;
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
        ctx.fillStyle = '#ffffff';
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
        ctx.fillStyle = '#4caf50';
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
      case 'empty':
        ctx.clearRect(x, y, cellSize, cellSize);
        break;
    }
  }
  