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
  
    // Almacena las posiciones de los fantasmas
    const ghosts = [];
  
    drawGameBoard(ctx, gameBoard, cellSize);
    drawElement(ctx, pacmanRow, pacmanColumn, 'pacman', cellSize);
  
    // Coloca 4 fantasmas en posiciones aleatorias
    for (let i = 0; i < 4; i++) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomColumn = Math.floor(Math.random() * columns);
      ghosts.push({ row: randomRow, column: randomColumn });
      drawElement(ctx, randomRow, randomColumn, 'ghost', cellSize);
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
        // Limpiar el tablero y volver a dibujar todos los elementos
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawGameBoard(ctx, gameBoard, cellSize);
        drawElement(ctx, pacmanRow, pacmanColumn, 'pacman', cellSize);
  
        // Volver a dibujar los fantasmas
        for (const ghost of ghosts) {
          drawElement(ctx, ghost.row, ghost.column, 'ghost', cellSize);
        }
      }
    });
  
    function movePacman(direction) {
      // Calcular la nueva posición del Pacman según la dirección
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
  
      // Verificar si la nueva posición está ocupada por un muro
      if (gameBoard[newPacmanRow][newPacmanColumn] === 'empty') {
        pacmanRow = newPacmanRow;
        pacmanColumn = newPacmanColumn;
        return true; // Se movió con éxito
      }
  
      return false; // No se movió debido a un obstáculo
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
        ctx.fillStyle = '#ffffff'; // Color de celda vacía
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
        ctx.fillStyle = '#ffeb3b'; // Color de Pacman
        ctx.beginPath();
        ctx.arc(x + cellSize / 2, y + cellSize / 2, cellSize / 2, 0.2 * Math.PI, 1.8 * Math.PI);
        ctx.lineTo(x + cellSize / 2, y + cellSize / 2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'ghost':
        ctx.fillStyle = '#4caf50'; // Color de los fantasmas
        ctx.fillRect(x, y, cellSize, cellSize);
        break;
    }
  }
  