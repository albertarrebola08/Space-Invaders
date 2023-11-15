document.addEventListener('DOMContentLoaded', function () {
    const canvas = document.getElementById('gameCanvas');
    const ctx = canvas.getContext('2d');
  
    // Preguntar al usuario por las dimensiones del espacio de juego
    const rows = prompt('Ingrese el número de filas:');
    const columns = prompt('Ingrese el número de columnas:');
  
    // Definir el tamaño de cada celda
    const cellSize = 30;
    canvas.width = columns * cellSize;
    canvas.height = rows * cellSize;
  
    // Crear el espacio de juego
    const gameBoard = createGameBoard(rows, columns);
  
    // Dibujar las celdas iniciales
    drawGameBoard(ctx, gameBoard, cellSize);
  
    // Dibujar los elementos iniciales
    drawElement(ctx, 0, 0, 'pacman', cellSize); // Pacman en la esquina superior izquierda
  
    // Colocar 4 fantasmas en posiciones aleatorias
    for (let i = 0; i < 4; i++) {
      const randomRow = Math.floor(Math.random() * rows);
      const randomColumn = Math.floor(Math.random() * columns);
      drawElement(ctx, randomRow, randomColumn, 'ghost', cellSize);
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
  