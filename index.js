
document.addEventListener('DOMContentLoaded', function () {
  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');


  const objectDimensions = {
    playerShip: { width: 50, height: 70 },
    enemy: { width: 50, height: 50 },
    coin: { width: 15, height: 15 },
    life: { width: 20, height: 20 },
    bullet: { width: 5, height: 10 },
    explosion: {width: 80, height: 80}
};



  
  const playerShipWidth = objectDimensions.playerShip.width;
  const playerShipHeight = objectDimensions.playerShip.height;
  
  const enemyShipWidth = objectDimensions.enemy.width;
  const enemyShipHeight = objectDimensions.enemy.height;
  
  
  const coinWidth = objectDimensions.coin.width;
  const coinHeight = objectDimensions.coin.height;
  
  const lifeWidth = objectDimensions.life.width;
  const lifeHeight = objectDimensions.life.height;
  
  const bulletWidth = objectDimensions.bullet.width;
  const bulletHeight = objectDimensions.bullet.height;
  
  const playerShipSpeed = 3;
  const enemyShipSpeed = 0.6;
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

  const bulletCollisions = [];


  const playerShip = {
    x: (canvas.width - objectDimensions.playerShip.width) / 2,
    y: canvas.height - objectDimensions.playerShip.height,
    speed: playerShipSpeed,
    type: 'player',
    firing: false
  };

  const coinImage = new Image();
  coinImage.onload = startGame; // Llama a startGame cuando la imagen de la moneda se carga
  coinImage.src = 'coin-image.webp';
  
  const lifeImage = new Image();
  lifeImage.onload = startGame; // Llama a startGame cuando la imagen de la vida se carga
  lifeImage.src = 'life-image.png';
  
  const enemyShipImages = [
    'enemy-ship-type-1.png',
    'enemy-ship-type-2.png',
    'enemy-ship-type-3.png'
  ];
  
  const enemyShips = enemyShipImages.map(src => {
    const image = new Image();
    image.onload = startGame; // Llama a startGame cuando una imagen de nave enemiga se carga
    image.src = src;
    return image;
  });
  
  const playerShipImage = new Image();
  playerShipImage.onload = startGame; // Llama a startGame cuando la imagen de la nave del jugador se carga
  playerShipImage.src = 'player-ship-image.png';
  
  let imagesLoaded = 0;
  
  function startGame() {
    imagesLoaded++;
    if (imagesLoaded === 5) {
      // Todas las imágenes están cargadas, inicia el juego
      draw();
    }
  }
  function randomXPosition(type) {
    const maxWidth = canvas.width - objectDimensions.playerShip.width;
    
    // Dependiendo del tipo de nave, ajusta la posición inicial
    if (type === 'player') {
      return Math.random() * maxWidth;
    } else if (type.startsWith('enemy')) {
      // Para las naves enemigas, garantiza que la nueva nave no se superponga con otras
      let x;
      do {
        x = Math.random() * maxWidth;
      } while (objects.some(obj => obj.type.startsWith('enemy') && Math.abs(obj.x - x) < objectDimensions.playerShip.width));
      
      return x;
    } else {
      return Math.random() * maxWidth;
    }
  }
  function drawShip(x, y, type, subtype) {
    let image;
  
    if (type === 'player') {
      image = playerShipImage;
    } else if (type === 'enemy') {
      // Obtén el índice de la imagen de la nave enemiga según el subtipo
      const enemyIndex = getEnemyImageIndex(subtype);
      image = enemyShips[enemyIndex];
    }
  
    const width =
      type === 'coin' ? coinWidth :
      type === 'life' ? lifeWidth :
      type === 'enemy' ? enemyShipWidth :
      playerShipWidth;
  const height =
      type === 'coin' ? coinHeight :
      type === 'life' ? lifeHeight :
      type === 'enemy' ? enemyShipHeight :
      playerShipHeight;

  
    ctx.drawImage(image, x, y, width, height);
  }
  
  function drawCoin(x, y, collected) {
    if (!collected) {
      ctx.drawImage(coinImage, x, y, coinWidth, coinHeight);
    }
  }
  
  function drawLife(x, y) {
    ctx.drawImage(lifeImage, x, y, lifeWidth, lifeHeight);
  }
  
  function drawBullet(x, y) {
    ctx.beginPath();
    ctx.rect(x, y, bulletWidth, bulletHeight);
    ctx.fillStyle = '#e74c3c';
    ctx.fill();
    ctx.closePath();
  }
  

  
  function getEnemyImageIndex(subtype) {
    switch (subtype) {
      case 'enemy-ship-type-1':
        return 0;
      case 'enemy-ship-type-2':
        return 1;
      case 'enemy-ship-type-3':
        return 2;
      default:
        return 0; // Cambia el valor predeterminado según tus necesidades
    }
  }
  

  
  
//detecto la colision con objetos
function collisionDetection(obj1, obj2) {
  return (
    obj1.x < obj2.x + objectDimensions.playerShip.width &&
    obj1.x + objectDimensions.playerShip.width > obj2.x &&
    obj1.y < obj2.y + objectDimensions.playerShip.height &&
    obj1.y + objectDimensions.playerShip.height > obj2.y
  );
}

function moveObjects() {
  for (let i = 0; i < objects.length; i++) {
    const speed = getSpeed(objects[i].type);
    objects[i].y += speed;

    if (collisionDetection(playerShip, objects[i])) {
      handleCollision(objects[i]);
    }

    if (objects[i] && objects[i].y > canvas.height) {
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

  const enemyShipStats = {
    'enemy-ship-type-1': { shotsToDestroy: 3, shotsReceived: 0 },
    'enemy-ship-type-2': { shotsToDestroy: 5, shotsReceived: 0 },
    'enemy-ship-type-3': { shotsToDestroy: 6, shotsReceived: 0 }
  };

  const explosionImage = new Image();
  explosionImage.onload = startGame; // O cualquier otra lógica que desees
  explosionImage.src = 'explosion-img.png'; // Ajusta la ruta según tu proyecto

  

  function handleBulletCollision(bullet) {
    // Verifica si este proyectil ya ha colisionado previamente con alguna nave enemiga
    if (!bulletCollisions.includes(bullet)) {
      for (let i = 0; i < objects.length; i++) {
        const object = objects[i];
        if (object.type === 'enemy' && collisionDetection(bullet, object)) {
          // Incrementa aquí la cantidad de impactos o realiza la lógica deseada
          console.log('Impacto en nave enemiga');
  
          // Incrementa el contador de disparos recibidos para este tipo de nave
          enemyShipStats[object.subtype].shotsReceived++;
  
          // Verifica si la nave enemiga ha sido destruida
          if (enemyShipStats[object.subtype].shotsReceived >= enemyShipStats[object.subtype].shotsToDestroy) {
            console.log(`Nave ${object.subtype} destruida`);
  
            // Agrega un objeto de tipo 'explosion' con la posición de la nave
            objects.push({
              x: object.x,
              y: object.y,
              type: 'explosion',
              image: explosionImage
            });
  
            // Elimina la nave de la matriz de objetos solo si aún está presente
            const index = objects.indexOf(object);
            if (index !== -1) {
              objects.splice(index, 1);
  
              // Restablece el contador de disparos recibidos para este tipo de nave
              enemyShipStats[object.subtype].shotsReceived = 0;
              console.log(`Nave ${object.subtype} eliminada después de la explosión`);
            }
          }
  
          // Agrega este proyectil al registro de colisiones
          bulletCollisions.push(bullet);
          break;
        }
      }
    }
  }
  
  
  
  
  
function draw() {
  const currentTime = Date.now();
  const elapsedTimeSinceLastSpawn = currentTime - lastSpawnTime;

  const explosionWidth = objectDimensions.explosion.width;
  const explosionHeight = objectDimensions.explosion.height;


  ctx.clearRect(0, 0, canvas.width, canvas.height);

  moveObjects();
  moveBullets();

  for (const object of objects) {
    if (object.destroyed) continue;

    if (object.type === 'explosion') {
      // Dibuja la imagen de la explosión
      ctx.drawImage(object.image, object.x, object.y, explosionWidth, explosionHeight);
    
     // Elimina la explosión después de 500 milisegundos
     setTimeout(() => {
      object.destroyed = true;
    }, 500);
    } else if (object.type === 'coin') {
      drawCoin(object.x, object.y, object.collected);
    } else if (object.type === 'life') {
      drawLife(object.x, object.y);
    } else {
      const dimensions = objectDimensions[object.type] || { width: playerShipWidth, height: playerShipHeight };
      drawShip(object.x, object.y, object.type, object.subtype, dimensions.width, dimensions.height);
    }
  }

  for (const bullet of bullets) {
    drawBullet(bullet.x, bullet.y);
    handleBulletCollision(bullet);
  }

  drawShip(playerShip.x, playerShip.y, playerShip.type);

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

        // Verificar si objectType es una clave válida en objectDimensions
        if (objectType in objectDimensions) {
            const objectSubtype = objectType === 'enemy' ? getRandomEnemyType() : null;
            const { width, height } = objectDimensions[objectType];
            objects.push({ x: randomXPosition(objectType, width), y: 0, type: objectType, subtype: objectSubtype, width, height });
            lastSpawnTime = currentTime;
        } else {
            // Log o manejar el caso en que objectType no sea válido
            console.error('objectType no válido:', objectType);
        }
    }
}

  movePlayerShip();

  if (spacePressed && !playerShip.firing) {
    bullets.push({ x: playerShip.x + (playerShipWidth / 2) - (bulletWidth / 2), y: playerShip.y });
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
    if (rightPressed && playerShip.x < canvas.width - objectDimensions.playerShip.width) {
      playerShip.x += playerShip.speed;
    } else if (leftPressed && playerShip.x > 0) {
      playerShip.x -= playerShip.speed;
    }

    if (upPressed && playerShip.y > 0) {
      playerShip.y -= playerShip.speed;
    } else if (downPressed && playerShip.y < canvas.height - objectDimensions.playerShip.height) {
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
  

  function getRandomEnemyType() {
    const randomNumber = Math.random();
    if (randomNumber < 0.33) {
      return 'enemy-ship-type-1';
    } else if (randomNumber < 0.66) {
      return 'enemy-ship-type-2';
    } else {
      return 'enemy-ship-type-3';
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
      if (i < lives) {
        // Corazón lleno
        ctx.drawImage(heartImage, heartX, heartY, heartSize, heartSize);
      }
    }
  }
});