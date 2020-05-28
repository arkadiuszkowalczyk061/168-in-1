
//document.getElementById  id from html  exe: can

const canv = document.querySelector('canvas');
const ctx = canv.getContext('2d');   //3d different methods


canv.width = 1000;
canv.height = 500;

const cw = canv.width;
const ch = canv.height;
window.onkeydown = ControlPlayerTwo;

const ballSize = 20 // size ball


let ballX = cw/2 - ballSize/2;
let ballY = ch/2 - ballSize/2;

const paddleHeight = 100;
const paddleWidth = 20;

const playerX = 70;
const playerTwoX = 910;

let playerY = 200;
let playerTwoY = 200;

const lineWidth = 6;
const lineHeight = 16;

let ballSpeedX = 3;
let ballSpeedY = 3;

const accelerPaddle = 25;




function player() {
    ctx.fillStyle = '#7FFF00';
    ctx.fillRect(playerX, playerY, paddleWidth, paddleHeight)
    let KurwinoxPosition = { JanuszX : playerX , JanuszY : playerY ,
        paddleW : paddleWidth, paddleH : paddleHeight
    }
    return KurwinoxPosition
}

function playerTwo() {
    ctx.fillStyle = 'blue';
    ctx.fillRect(playerTwoX , playerTwoY , paddleWidth, paddleHeight)
    let JurasPosition = { JurasX : playerTwoX, JurasY : playerTwoY ,
        paddleW : paddleWidth, paddleH : paddleHeight
    }
    return JurasPosition
}


function ball() {
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(ballX, ballY, ballSize, ballSize);
    ballX += ballSpeedX;
    ballY += ballSpeedY;
    if (ballY <=0 || ballY + ballSize >= ch) {
        ballSpeedY = - ballSpeedY;
        velocity()
    }
    if (ballX <0 || ballX + ballSize >= cw) {
        ballSpeedX = - ballSpeedX;
        velocity()
    }
    let ballPosition = { pilkaX : ballX, pilkaY : ballY,
        ballW : ballSize, ballH : ballSize
    }

    return ballPosition
}

function table() {
    ctx.fillStyle = 'red';
    ctx.fillRect(0, 0, cw, ch);

    for (let linePosition = 20; linePosition < ch; linePosition +=30) {
        ctx.fillStyle = 'gray'
        ctx.fillRect(cw/2 - lineWidth/2, linePosition, lineWidth, lineHeight)
    }
}
topCanv = canv.offsetTop;

function playerPosition(event) {
    playerY = event.clientY - topCanv - (paddleHeight/2);
    if (playerY >= ch - paddleHeight)
        playerY = ch -paddleHeight;
    if (playerY <=0)
        playerY = 0;
}

function velocity() {
    if ( ballSpeedX > 0 && ballSpeedX < 18) {
        ballSpeedX += 1;
    }
    else if (ballSpeedX < 0 && ballSpeedX < -18){
        ballSpeedX += -1;
        }

    if ( ballSpeedY > 0 && ballSpeedY < 18) {
        ballSpeedY += 1;
    }
    else if (ballSpeedY < 0 && ballSpeedY < -18){
        ballSpeedY += -1;
        }
}


function playerTwoPosition(event) {
    console.log(event)
}

function ControlPlayerTwo (event) {
    if (playerTwoY >= ch - paddleHeight)
        playerTwoY = ch - paddleHeight;
    if (playerTwoY <=0)
        playerTwoY = 0;
    if (event.keyCode === 38 || event.keyCode === 40) {
        playerTwoY += accelerPaddle * (event.keyCode === 38 ? -1 : 1)
    }
}

canv.addEventListener("mousemove", playerPosition)


// canv.addEventListener("keyup", playerTwoPosition)


function tableResult() {
    let cos = 'Kurwinox Janusz'
    let wynik = 0
    let play2 = 'Zdupydomordyzaur Jerzy'
    ctx.font = 'italic 18px Arial';
    ctx.fillStyle = 'white';
    ctx.fillText(cos + ' : ' + wynik, 25, 25);
    ctx.fillText(play2 + ' : ' + wynik, 700, 25);
}


function RectsColliding(r1,r2){
    console.log(r1())
    return !(
    r1.JanuszX>r2.pilkaX+r2.ballW ||
    r1.JanuszX+r1.paddleW<r2.pilkaX ||
    r1.JanuszY>r2.pilkaY+r2.ballH ||
    r1.JanuszY+r1.paddleH<r2.pilkaY
    );

}


function inGame() {
    table()
    ball()
    player()
    playerTwo()
    tableResult()
    RectsColliding(player, ball)

}



setInterval(inGame,10)