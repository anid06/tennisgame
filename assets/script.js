var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 4;
var paddle1Y = 250;
var paddle2Y = 250;
const widthPaddle = 10;
const heightPaddle = 100;

var player1Score = 0;
var player2Score = 0;
const winningScore = 10;

var showingWinScreen = false;

function calculateMousePos(evt) {
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    return {
        x: mouseX,
        y: mouseY
    };

}

function handleMouseClick(evt) {
    if (showingWinScreen) {
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}


window.onload = function () {
    canvas = document.getElementById('gameCanvas');
    canvasContext = canvas.getContext('2d');

    var framesPerSecond = 30;

    setInterval(function () {
        moveEverythink();
        drawEverythink();
    }, 1000 / framesPerSecond);

    canvas.addEventListener("mousedown", handleMouseClick);

    canvas.addEventListener('mousemove', function (evt) {
        var mousePos = calculateMousePos(evt);

        if (mousePos.x < canvas.width / 2) {
            paddle1Y = mousePos.y - (heightPaddle / 2);
        }
        else {
            paddle2Y = mousePos.y - (heightPaddle / 2);
        }
    })

}

function ballReset() {

    if (player1Score >= winningScore || player2Score >= winningScore) {
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement() {
    var paddle2YCenter = paddle2Y + (heightPaddle / 2);
    if (paddle2YCenter < ballY - 35) {
        paddle2Y += 6;
    }
    else if (paddle2Y > ballY + 35) {
        paddle2Y -= 6;
    }
}

function moveEverythink() {
    if (showingWinScreen) {
        return;
    }
    computerMovement();

    ballX += ballSpeedX;
    ballY += ballSpeedY;

    if (ballX < 0) {
        if (
            ballY > paddle1Y
            && ballY < paddle1Y + heightPaddle
        ) {
            ballSpeedX = -ballSpeedX;

            var deltaY = ballY - (paddle1Y + heightPaddle / 2);
            ballSpeedY = deltaY * 0.35;
        }
        else {
            player2Score++;  //must be before ballReset()
            ballReset();
        }
    }

    if (ballX > canvas.width) {
        if (
            ballY > paddle2Y
            && ballY < paddle2Y + heightPaddle
        ) {
            ballSpeedX = -ballSpeedX;
            var deltaY = ballY - (paddle2Y + heightPaddle / 2);
            ballSpeedY = deltaY * 0.35;
        }
        else {
            player1Score++; //must be before ballReset()
            ballReset();
        }
    }

    if (ballY > canvas.height || ballY < 0) {
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet() {
    for (var i = 10; i < canvas.height; i += 40)
        colorRect(canvas.width / 2 - 1, i, 2, 20, 'white')

}


function drawEverythink() {

    console.log(ballX);
    //table
    colorRect(0, 0, canvas.width, canvas.height, 'blue');

    if (showingWinScreen) {
        canvasContext.fillStyle = 'white';

        if (player1Score >= winningScore) {
            canvasContext.fillText("LEFT PLAYER WON!", 360, 250);
        }
        else
            if (player2Score >= winningScore) {
                canvasContext.fillText("RIGHT PLAYER 1 WON!", 360, 250);
            }

        canvasContext.fillText("click to continue", 370, 300);
        return;
    }

    drawNet();

    //left player paddle
    colorRect(0, paddle1Y, widthPaddle, heightPaddle, 'white');
    //right player paddle
    colorRect(canvas.width - widthPaddle, paddle2Y, widthPaddle, heightPaddle, 'white');
    //ball
    colorCircle(ballX, ballY, 10, 'white');

    canvasContext.fillText(player1Score, 200, 100);
    canvasContext.fillText(player2Score, 600, 100);
}

function colorRect(leftX, topY, width, height, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.fillRect(leftX, topY, width, height);
}

function colorCircle(centerX, centerY, radius, drawColor) {
    canvasContext.fillStyle = drawColor;
    canvasContext.beginPath();
    canvasContext.arc(centerX, centerY, radius, 0, Math.PI * 2, true);
    canvasContext.fill();
}

