const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");
const scoreEl = document.getElementById("score");
const restartBtn = document.getElementById("restart");

const gridSize = 20;
const tileCount = canvas.width / gridSize;

let snake, direction, food, score, gameLoop, gameOver;

function init() {
  snake = [
    { x: 10, y: 10 },
    { x: 9, y: 10 },
    { x: 8, y: 10 },
  ];
  direction = { x: 1, y: 0 };
  score = 0;
  gameOver = false;
  scoreEl.textContent = score;
  placeFood();
  clearInterval(gameLoop);
  gameLoop = setInterval(update, 120);
}

function placeFood() {
  do {
    food = {
      x: Math.floor(Math.random() * tileCount),
      y: Math.floor(Math.random() * tileCount),
    };
  } while (snake.some((seg) => seg.x === food.x && seg.y === food.y));
}

function update() {
  if (gameOver) return;

  const head = {
    x: snake[0].x + direction.x,
    y: snake[0].y + direction.y,
  };

  if (
    head.x < 0 ||
    head.x >= tileCount ||
    head.y < 0 ||
    head.y >= tileCount ||
    snake.some((seg) => seg.x === head.x && seg.y === head.y)
  ) {
    endGame();
    return;
  }

  snake.unshift(head);

  if (head.x === food.x && head.y === food.y) {
    score++;
    scoreEl.textContent = score;
    placeFood();
  } else {
    snake.pop();
  }

  draw();
}

function draw() {
  ctx.fillStyle = "#0f0f23";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "#4ade80";
  snake.forEach((seg, i) => {
    ctx.globalAlpha = i === 0 ? 1 : 0.85;
    ctx.fillRect(seg.x * gridSize, seg.y * gridSize, gridSize - 2, gridSize - 2);
  });
  ctx.globalAlpha = 1;

  ctx.fillStyle = "#f87171";
  ctx.fillRect(food.x * gridSize, food.y * gridSize, gridSize - 2, gridSize - 2);
}

function endGame() {
  gameOver = true;
  clearInterval(gameLoop);
  ctx.fillStyle = "rgba(0,0,0,0.6)";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 28px system-ui";
  ctx.textAlign = "center";
  ctx.fillText("Game Over!", canvas.width / 2, canvas.height / 2 - 10);
  ctx.font = "18px system-ui";
  ctx.fillText(`Score: ${score}`, canvas.width / 2, canvas.height / 2 + 25);
}

document.addEventListener("keydown", (e) => {
  const key = e.key;
  if (key === "ArrowUp" && direction.y !== 1) direction = { x: 0, y: -1 };
  if (key === "ArrowDown" && direction.y !== -1) direction = { x: 0, y: 1 };
  if (key === "ArrowLeft" && direction.x !== 1) direction = { x: -1, y: 0 };
  if (key === "ArrowRight" && direction.x !== -1) direction = { x: 1, y: 0 };
});

restartBtn.addEventListener("click", init);

init(); 