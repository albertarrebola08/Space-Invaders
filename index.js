
document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const shipWidth = 40;
  const shipHeight = 20;
  const bulletWidth = 5;
  const bulletHeight = 10;
  const playerShipSpeed = 5;
  const enemyShipSpeed = 1;
  const coinSpeed = 0.5;
  const lifeSpeed = 0.3;
  const bulletSpeed = 5;
  const objects = [];
  const bullets = [];
  const ships = [];
  let rightPressed = false;
  let leftPressed = false;
  let upPressed = false;
  let downPressed = false;
  let spacePressed = false;
  let lastSpawnTime = 0;
  let lives = 10;
  let score = 0;

  const playerShip = {
    x: (canvas.width - shipWidth) / 2,
    y: canvas.height - shipHeight,
    speed: playerShipSpeed,
    type: 'player',
    firing: false
  };

  const coinImage = new Image();
  coinImage.src = 'coin-image.webp'; // Reemplaza 'path/to/coin-image.png' con la ruta real de tu imagen de moneda

  const lifeImage = new Image();
  lifeImage.src = 'life-image.png'; // Reemplaza 'path/to/life-image.png' con la ruta real de tu imagen de vida

  const enemyShipImages = [
    'enemy-ship-type-1.png',
    'enemy-ship-type-2.png',
    'enemy-ship-type-3.png'
  ];

  const enemyShips = enemyShipImages.map(src => {
    const image = new Image();
    image.src = src;
    return image;
  });

  const playerShipImage = new Image();
  playerShipImage.src = 'player-ship-image.png'; // Reemplaza 'path/to/player-ship-image.png' con la ruta real de tu imagen de nave del jugador

  function randomXPosition() {
    return Math.random() * (canvas.width - shipWidth);
  }

  function drawShip(x, y, type) {
    const image = (type === 'player') ? playerShipImage : enemyShips[0];
    ctx.drawImage(image, x, y, shipWidth, shipHeight);
  }

  function drawCoin(x, y, collected) {
    if (!collected) {
      ctx.drawImage(coinImage, x, y, shipWidth, shipHeight);
    }
  }

  function drawLife(x, y) {
    ctx.drawImage(lifeImage, x, y, shipWidth / 2, shipHeight / 2);
  }

  function drawBullet(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, bulletWidth, bulletHeight);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();
  }
  
//detecto la colision con objetos
function collisionDetection(obj1, obj2) {
  return (
    obj1.x < obj2.x + shipWidth &&
    obj1.x + shipWidth > obj2.x &&
    obj1.y < obj2.y + shipHeight &&
    obj1.y + shipHeight > obj2.y
  );
}

  function moveObjects() {
    for (let i = 0; i < objects.length; i++) {
      const speed = getSpeed(objects[i].type);
      objects[i].y += speed;
  
      if (collisionDetection(playerShip, objects[i])) {
        handleCollision(objects[i]);
      }
  
      if (objects[i].y > canvas.height) {
        objects.splice(i, 1);
        i--;
      }
    }
  }

  
  
  //controlo la colision miro de que tipo es y llamo a una funcion o a otra
  function handleCollision(object) {
    switch (object.type) {
      case 'coin':
        handleCoinCollected(object);
        break;
      case 'enemy':
        handleEnemyCollision(object);
        break;
      case 'life':
        handleLifeCollected(object);
        break;
      // Agrega más casos según tus necesidades
    }
  }

  
  let lastEnemyCollisionTime = 0;
  const collisionCooldown = 1000; // 1000 milisegundos (1 segundo)

function handleEnemyCollision(enemy) {
  // Verificar si ha pasado suficiente tiempo desde la última colisión
  const currentTime = Date.now();
  if (currentTime - lastEnemyCollisionTime >= collisionCooldown) {
    // Restar vidas (ajustar según tus necesidades)
    lives -= 2;
    if(lives==0){
      alert('Game Over');

    }
    console.log('Vidas restantes:', lives);

    // Actualizar el tiempo de la última colisión
    lastEnemyCollisionTime = currentTime;
  }
}

  function handleLifeCollected(life) {
    life.collected = true;
    // Sumar vidas (ajustar según tus necesidades)
    if (lives < 10 ) lives++;
    console.log('Vidas restantes:', lives);
  
    // Eliminar el objeto solo si aún está presente en la matriz
    const index = objects.indexOf(life);
    if (index !== -1) {
      objects.splice(index, 1);
    }
  }
  
  function handleCoinCollected(coin) {
    if (!coin.collected) {
      coin.collected = true;
      // Incrementar el puntaje
      score++;
      console.log('Puntaje:', score);
  
    }
  }

  function moveBullets() {
    for (let i = 0; i < bullets.length; i++) {
      bullets[i].y -= bulletSpeed;

      if (bullets[i].y < 0) {
        bullets.splice(i, 1);
        i--;
      }
    }
  }

  
  function draw() {
    const currentTime = Date.now();
    const elapsedTimeSinceLastSpawn = currentTime - lastSpawnTime;
  
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  
    moveObjects();
    moveBullets();
  
    for (const object of objects) {
      if (object.type === 'coin') {
        drawCoin(object.x, object.y, object.collected);
      } else if (object.type === 'life') {
        drawLife(object.x, object.y);
      } else {
        drawShip(object.x, object.y, object.type);
      }
    }
  
    for (const bullet of bullets) {
      drawBullet(bullet.x, bullet.y);
    }
  
    drawShip(playerShip.x, playerShip.y, playerShip.type);
  
    // Mostrar el puntaje en algún lugar del lienzo
    ctx.font = '16px Arial';
    ctx.fillStyle = '#ffffff';
    ctx.fillText('Puntaje: ' + score, 10, 20);
    drawHearts();


    for (const bullet of bullets) {
      drawBullet(bullet.x, bullet.y);
    }

    drawShip(playerShip.x, playerShip.y, playerShip.type);

    if (elapsedTimeSinceLastSpawn > 1000) {
      if (Math.random() < 0.02) {
        const objectType = getRandomObjectType();
        objects.push({ x: randomXPosition(), y: 0, type: objectType });
        lastSpawnTime = currentTime;
      }
    }

    movePlayerShip();

    if (spacePressed && !playerShip.firing) {
      // Solo permitir disparos si no se está disparando actualmente
      bullets.push({ x: playerShip.x + (shipWidth / 2) - (bulletWidth / 2), y: playerShip.y });
      playerShip.firing = true;
    }

    requestAnimationFrame(draw);
  }





  document.addEventListener('keydown', keyDownHandler);
  document.addEventListener('keyup', keyUpHandler);

  function keyDownHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      rightPressed = true;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      leftPressed = true;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      upPressed = true;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      downPressed = true;
    } else if (e.key === ' ') {
      spacePressed = true;
    }
  }

  function keyUpHandler(e) {
    if (e.key === 'Right' || e.key === 'ArrowRight') {
      rightPressed = false;
    } else if (e.key === 'Left' || e.key === 'ArrowLeft') {
      leftPressed = false;
    } else if (e.key === 'Up' || e.key === 'ArrowUp') {
      upPressed = false;
    } else if (e.key === 'Down' || e.key === 'ArrowDown') {
      downPressed = false;
    } else if (e.key === ' ') {
      spacePressed = false;
      playerShip.firing = false; // Restablecer el estado de disparo cuando se suelta la barra espaciadora
    }
  }

  function movePlayerShip() {
    if (rightPressed && playerShip.x < canvas.width - shipWidth) {
      playerShip.x += playerShip.speed;
    } else if (leftPressed && playerShip.x > 0) {
      playerShip.x -= playerShip.speed;
    }

    if (upPressed && playerShip.y > 0) {
      playerShip.y -= playerShip.speed;
    } else if (downPressed && playerShip.y < canvas.height - shipHeight) {
      playerShip.y += playerShip.speed;
    }
  }

  function getSpeed(type) {
    switch (type) {
      case 'coin':
        return coinSpeed;
      case 'life':
        return lifeSpeed;
      default:
        return enemyShipSpeed;
    }
  }

  function getRandomObjectType() {
    const randomNumber = Math.random();
    if (randomNumber < 0.09) {
      return 'life'; // 2% de probabilidad de ser una vida
    } else if (randomNumber < 0.52) {
      return 'coin'; // 50% de probabilidad de ser una moneda
    } else {
      return 'enemy'; // 48% de probabilidad de ser una nave enemiga
    }
  }

// Asegúrate de tener las rutas correctas a tus imágenes de corazones
const heartImage = new Image();
heartImage.src = 'life-image.png';
  draw();
  

  function drawHearts() {
    const heartSize = 20; // Tamaño del corazón
    const spacing = 5; // Espaciado entre los corazones
    const startX = 100; // Posición inicial en X para los corazones

    for (let i = 0; i < 10; i++) {
      const heartX = startX + i * (heartSize + spacing);
      const heartY = 10; // Posición en Y para los corazones

      // Dibujar corazón lleno o vacío según el número de vidas
      if (i * 2 < lives) {
        // Corazón lleno
        ctx.drawImage(heartImage, heartX, heartY, heartSize, heartSize);
      }
    }
  }
});
