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
    missileMaxSpeed: 250
}

const gameState = {
    lastTime: Date.now(),
    leftPressed: false,
    rightPressed: false,
    shootPressed: false,
    playerX:0,
    playerY:0,
    missiles: []
};

function setPosition($element, x, y) {
    $element.style.transform = `translate(${x}px, ${y}px`;
}

function limitPlayer(playerPosition, min, max) {
    if (playerPosition < min) {
        return min;
    } else if (playerPosition > max) {
        return max;
    } else {
        return playerPosition;
    }

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
    const audio = new Audio('https://youtu.be/JmndxoF74qQ?t=47');
    audio.play();
}


function init() {
    const $container = document.querySelector('.game');
    createPlayer($container);
}


// https://isaacsukin.com/news/2015/01/detailed-explanation-javascript-game-loops-and-timing wyczytałem, że generalnie gierka może chodzić różnie na innych komputerach w zależności od tego ile mogą wygenerować klatek i generalnie warto uzależniać to od czasu
function update() {
    const currentTime = Date.now();
    const deltaTime = (currentTime - gameState.lastTime) / 1000;

    const $container = document.querySelector(".game")
    updatePlayer(deltaTime, $container);
    updateMissiles(deltaTime, $container)

    gameState.lastTime = currentTime;
    window.requestAnimationFrame(update);
}

function updateMissiles(deltaTime, $container) {
    const missiles = gameState.missiles;
    // missiles.forEach(missile => {
    //     console.log(missile)
    for (let i = 0; i<missiles.length; i++) {
        const missile = missiles[i];
        missile.y -= deltaTime * gameBoard.missileMaxSpeed;
        setPosition(missile.$element, missile.x, missile.y)
    }
}

function updatePlayer(deltaTime, $container) {
    if (gameState.leftPressed) {
        gameState.playerX -= deltaTime * gameBoard.playerMaxSpeed;
    }
    if (gameState.rightPressed) {
        gameState.playerX += deltaTime * gameBoard.playerMaxSpeed;
    }

    gameState.playerX = limitPlayer(gameState.playerX, gameBoard.playerWidth, gameBoard.gameWidth - gameBoard.playerWidth);

    if(gameState.shootPressed) {
        createMissile($container, gameState.playerX, gameState.playerY)
    }

    const $player = document.querySelector('.player')
    setPosition($player, gameState.playerX, gameState.playerY)
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