const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const gridSize = 20;
const canvasSize = canvas.width / gridSize;
let snake = [{ x: 10, y: 10 }];
let food = { x: 5, y: 5 };
let dx = 1;
let dy = 0;
let changingDirection = false;
let score = 0;
let highscoreList = JSON.parse(localStorage.getItem('highscores')) || [];

function startGame() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('highscore').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'block';

    snake = [{ x: 10, y: 10 }];
    dx = 1;
    dy = 0;
    score = 0;
    createFood();
    gameLoop();
}

function showInstructions() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('instructions').style.display = 'block';
}

function showHighscore() {
    document.getElementById('menu').style.display = 'none';
    document.getElementById('highscore').style.display = 'block';
    const scoreList = document.getElementById('scoreList');
    scoreList.innerHTML = highscoreList.map(score => `<p>${score.name}: ${score.score}</p>`).join('');
}

function backToMenu() {
    document.getElementById('menu').style.display = 'block';
    document.getElementById('instructions').style.display = 'none';
    document.getElementById('highscore').style.display = 'none';
    document.getElementById('gameCanvas').style.display = 'none';
    document.getElementById('gameOverScreen').style.display = 'none';
}

function gameOver() {
    document.getElementById('finalScore').textContent = score;
    document.getElementById('gameOverScreen').style.display = 'block';
    document.getElementById('gameCanvas').style.display = 'none';
}

function saveHighscore() {
    const playerName = document.getElementById('playerName').value;
    if (playerName) {
        highscoreList.push({ name: playerName, score: score });
        highscoreList.sort((a, b) => b.score - a.score);
        highscoreList = highscoreList.slice(0, 5);  // Keep only top 5 scores
        localStorage.setItem('highscores', JSON.stringify(highscoreList));
        backToMenu();
    }
}

function drawSnake() {
    ctx.fillStyle = 'green';
    snake.forEach(part => ctx.fillRect(part.x * gridSize, part.y * gridSize, gridSize, gridSize));
}

function drawFood() {
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize, gridSize);
}

function moveSnake() {
    const head = { x: snake[0].x + dx, y: snake[0].y + dy };
    if (isCollision(head)) {
        gameOver();
        return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        createFood();
    } else {
        snake.pop();
    }
}

function isCollision(head) {
    // Check for wall collision
    if (head.x < 0 || head.y < 0 || head.x >= canvasSize || head.y >= canvasSize) {
        return true;
    }
    // Check for self collision
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === head.x && snake[i].y === head.y) {
            return true;
        }
    }
    return false;
}

function createFood() {
    food = {
        x: Math.floor(Math.random() * canvasSize),
        y: Math.floor(Math.random() * canvasSize)
    };
}

function gameLoop() {
    if (document.getElementById('gameCanvas').style.display !== 'block') return;
    setTimeout(() => {
        clearCanvas();
        drawFood();
        moveSnake();
        drawSnake();
        changingDirection = false;
        gameLoop();
    }, 100);
}

function clearCanvas() {
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

document.addEventListener('keydown', changeDirection);
function changeDirection(event) {
    const keyPressed = event.keyCode;
    const LEFT_KEY = 37;
    const RIGHT_KEY = 39;
    const UP_KEY = 38;
    const DOWN_KEY = 40;

    if (changingDirection) return;
    changingDirection = true;

    if (keyPressed === LEFT_KEY && dx === 0) {
        dx = -1;
        dy = 0;
    } else if (keyPressed === RIGHT_KEY && dx === 0) {
        dx = 1;
        dy = 0;
    } else if (keyPressed === UP_KEY && dy === 0) {
        dx = 0;
        dy = -1;
    } else if (keyPressed === DOWN_KEY && dy === 0) {
        dx = 0;
        dy = 1;
    }
}

backToMenu(); // Initialize menu
