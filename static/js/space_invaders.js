const buttons = {
    moveLeftButtonCode: 65,
    moveRightButtonCode: 68,
    shootButtonCode: 32
}
const gameBoard = {
    gameWidth: 800,
    gameHeight: 600,
    playerWidth: 20,
    playerMaxSpeed: 500,
    missileMaxSpeed: 250,
    missileCooldown: 0.5,
    enemiesPerRow: 10,
    enemyHorizontalPadding: 80,
    enemyVerticalPadding: 70,
    enemyVerticalSpacing: 80,
    enemyCooldown: 2.0
}

const gameState = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    shootPressed: false,
    playerX:0,
    playerY:0,
    playerCooldown: 0,
    missiles: [],
    enemies: [],
    enemyMissiles: [],
    gameOver: false
};

function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px`;
}

function limitPlayer(playerPosition, min, max) {
    if (playerPosition < min) {
        return min;
    }
    if (playerPosition > max) {
        return max;
    }
    return playerPosition;
}

function collision(rect1, rect2) {
    return !(
        rect2.left > rect1.right ||
        rect2.right < rect1.left ||
        rect2.top > rect1.bottom ||
        rect2.bottom < rect1.top
    );
}

function randomCooldown(min, max) {
    if (min === undefined) min = 0;
    if (max === undefined) max = 1;
    return min + Math.random() * (max - min)

}

function createPlayer($container) {
    gameState.playerX = gameBoard.gameWidth / 2;
    gameState.playerY = gameBoard.gameHeight - 50;
    const $player = document.createElement('img');
    $player.src = "/static/img/player-red-1.png";
    $player.className = "player";
    $container.appendChild($player);
    setPosition($player, gameState.playerX, gameState.playerY);
}

function createMissile($container, x, y) {
    const $element = document.createElement("img");
    $element.src = "/static/img/laser-blue-1.png";
    $element.className = "missile";
    $container.appendChild($element);
    const missile = { x, y, $element };
    gameState.missiles.push(missile);
    setPosition($element, x, y);
    // const audio = new Audio('');
    // audio.play();
}

function createEnemy($container, x, y) {
    const $element = document.createElement('img');
    $element.src = '/static/img/enemy-black-2.png';
    $element.className = 'enemy';
    $container.appendChild($element);
    const enemy = {
        x,
        y,
        cooldown: randomCooldown(0.5, gameBoard.enemyCooldown),
        $element
    };
    gameState.enemies.push(enemy);
    setPosition($element, x, y);
}


function removeMissile($container, missile) {
    $container.removeChild(missile.$element);
    missile.isDead = true;

}

function destroyEnemy($container, enemy) {
    $container.removeChild(enemy.$element)
    enemy.isDead = true
}

function killPlayer($container, player) {
    $container.removeChild(player);
    gameState.gameOver = true;
}


function init() {
    const $container = document.querySelector('.game');
    createPlayer($container);

    const enemySpacing = (gameBoard.gameWidth - gameBoard.enemyHorizontalPadding * 2) / (gameBoard.enemiesPerRow - 1);

    for (let i = 0; i < 3; i++) {
        const y = gameBoard.enemyVerticalPadding + i * gameBoard.enemyVerticalSpacing;
        for (let j = 0; j < gameBoard.enemiesPerRow; j++) {
            const x = j * enemySpacing + gameBoard.enemyHorizontalPadding;
            createEnemy($container, x, y);
        }
    }
}


// https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing wyczytałem, że generalnie gierka może chodzić różnie na innych komputerach w zależności od tego ile mogą wygenerować klatek i generalnie warto uzależniać to od czasu
function update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - gameState.lastTime) / 1000;

    if (gameState.gameOver) {
        document.querySelector('.game-over').style.display = 'block';
        return;
    }


    if (playerWon()) {
        document.querySelector('.congratulations').style.display = 'block';
        return;
    }

    const $container = document.querySelector(".game")
    updatePlayer(deltaTime, $container);
    updateMissiles(deltaTime, $container);
    updateEnemies(deltaTime, $container);
    updateEnemyLasers(deltaTime, $container)
    gameState.lastTime = currentTime;
    window.requestAnimationFrame(update);
}


function updateMissiles(deltaTime, $container) {
    const missiles = gameState.missiles;
    missiles.forEach(missile => {
        missile.y -= deltaTime * gameBoard.missileMaxSpeed;
        if (missile.y < 0) {
            removeMissile($container, missile);
        }
        setPosition(missile.$element, missile.x, missile.y);
        const rect1 = missile.$element.getBoundingClientRect();
        const enemies = gameState.enemies;
        for (let i = 0; i < enemies.length; i++) {
            const enemy = enemies[i];
            if (enemy.isDead) continue;
            const rect2 = enemy.$element.getBoundingClientRect();
            if (collision(rect1, rect2)) {
                console.log(collision(rect1, rect2))
                destroyEnemy($container, enemy);
                removeMissile($container, missile);
                break;
            }
        }
    });
     gameState.missiles = gameState.missiles.filter(event => !event.isDead)
}

function updatePlayer(deltaTime, $container) {
    if (gameState.leftPressed) {
        gameState.playerX -= deltaTime * gameBoard.playerMaxSpeed;
    }
    if (gameState.rightPressed) {
        gameState.playerX += deltaTime * gameBoard.playerMaxSpeed;
    }

    gameState.playerX = limitPlayer(gameState.playerX, gameBoard.playerWidth, gameBoard.gameWidth - gameBoard.playerWidth);

    if(gameState.shootPressed && gameState.playerCooldown <= 0) {
        createMissile($container, gameState.playerX, gameState.playerY);
        gameState.playerCooldown = gameBoard.missileCooldown;
    }

    if(gameState.playerCooldown > 0) {
        gameState.playerCooldown -= deltaTime;
    }

    const $player = document.querySelector('.player')
    setPosition($player, gameState.playerX, gameState.playerY)
}

function updateEnemies(deltaTime, $container) {
    const dx = Math.sin(gameState.lastTime / 1000) * 50;
    const dy = Math.cos(gameState.lastTime / 1000) * 10;

    const enemies = gameState.enemies

    for (let i = 0; i < enemies.length; i++) {
        const enemy = enemies[i];
        const x = enemy.x + dx;
        const y = enemy.y + dy;
        setPosition(enemy.$element, x, y);
        enemy.cooldown -= deltaTime;
        if(enemy.cooldown <= 0) {
            createEnemyLaser($container, x, y);
            enemy.cooldown = randomCooldown(0.5, gameBoard.enemyCooldown);
        }
    }
    gameState.enemies = gameState.enemies.filter(e => !e.isDead)
}

function createEnemyLaser($container, x, y) {
    const $element = document.createElement('img');
    $element.src = '/static/img/laser-red-5.png';
    $element.className = 'enemy-laser';
    $container.appendChild($element);
    const laser = {x, y, $element};
    gameState.enemyMissiles.push(laser);
    setPosition($element,  x, y)
}

function updateEnemyLasers(deltaTime, $container) {
    const lasers = gameState.enemyMissiles
    for (let i = 0; i < lasers.length; i++) {
        const laser = lasers[i];
        laser.y += deltaTime * gameBoard.missileMaxSpeed
        if (laser.y > gameBoard.gameHeight - 20) {
            removeMissile($container, laser)
        }
        setPosition(laser.$element, laser.x, laser.y)
        const rect1 = laser.$element.getBoundingClientRect();
        const player = document.querySelector('.player');
        const rect2 = player.getBoundingClientRect();
        if (collision(rect1, rect2)) {
            killPlayer($container, player);
            break;
        }
    }
    gameState.enemyMissiles = gameState.enemyMissiles.filter (e => !e.isDead)
}

function playerWon() {
    return gameState.enemies.length === 0;
}

//old
// gameState.playerX -= 5;
// const $player = document.querySelector('.player');
// setPosition($player, gameState.playerX, gameState.playerY);
// gameState.playerX += 5;
// const $player = document.querySelector('.player');
// setPosition($player, gameState.playerX, gameState.playerY);

function onKeyDown(event) {
  if (event.keyCode === buttons.moveLeftButtonCode) {
      gameState.leftPressed = true;
  }  else if (event.keyCode === buttons.moveRightButtonCode) {
        gameState.rightPressed = true;
  }  else if (event.keyCode === buttons.shootButtonCode) {
        gameState.shootPressed = true;
  }
}

function onKeyUp(event) {
  if (event.keyCode === buttons.moveLeftButtonCode) {
      gameState.leftPressed = false;
  } else if (event.keyCode === buttons.moveRightButtonCode) {
        gameState.rightPressed = false;
    }
    else if (event.keyCode === buttons.shootButtonCode) {
        gameState.shootPressed = false;
  }
}

init();
window.addEventListener("keydown", onKeyDown)
window.addEventListener('keyup', onKeyUp)
window.requestAnimationFrame(update)