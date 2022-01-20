/* By Izmodenov Danil */

const canvas = document.getElementById("game");
const context = canvas.getContext("2d");
const pointsConter = document.getElementById("points");
const timeCounter = document.getElementById("time");
const gameOverBoard = document.getElementById("game-over");

const GRID = 16;
const DEFAULT_TIME = 180;
const DEFAULT_UNSPEED = 5;
let timeInterval;
let points = 0;
let count = 0;
let unspeed = DEFAULT_UNSPEED;
let time = DEFAULT_TIME;
let isStarted = false;
const snake = {
  x: 160,
  y: 160,
  dx: GRID,
  dy: 0,
  cells: [],
  maxCells: 4,
};
const apple = {
  x: getRandomInt(0, 25) * GRID,
  y: getRandomInt(0, 25) * GRID,
};

// Генератор случайных чисел
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

// Игровой цикл
function loop() {
  if (time > 0) {
    requestAnimationFrame(loop); // Не понятно (!)
  }

  if (++count < unspeed) {
    return;
  }

  count = 0;
  context.clearRect(0, 0, canvas.width, canvas.height);

  snake.x += snake.dx;
  snake.y += snake.dy;

  if (snake.x < 0) {
    snake.x = canvas.width - GRID;
  } else if (snake.x >= canvas.width) {
    snake.x = 0;
  }

  if (snake.y < 0) {
    snake.y = canvas.height - GRID;
  } else if (snake.y >= canvas.height) {
    snake.y = 0;
  }

  snake.cells.unshift({ x: snake.x, y: snake.y });
  if (snake.cells.length > snake.maxCells) {
    snake.cells.pop();
  }

  context.fillStyle = "red";
  context.fillRect(apple.x, apple.y, GRID - 1, GRID - 1);

  context.fillStyle = "lightgreen";
  snake.cells.forEach((cell, index) => {
    context.fillRect(cell.x, cell.y, GRID - 1, GRID - 1);

    if (cell.x === apple.x && cell.y === apple.y) {
      snake.maxCells++;

      points++;
      pointsConter.innerHTML = `Очки: ${points}`;

      apple.x = getRandomInt(0, 25) * GRID;
      apple.y = getRandomInt(0, 25) * GRID;

      if (points % 16 == 0 && unspeed > 2) {
        unspeed--;
        if (unspeed == 2) {
          canvas.style.backgroundColor = "#4133ff";
        }
      }
    }

    for (let i = index + 1; i < snake.cells.length; i++) {
      if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y) {
        time = 0;
      }
    }
  });
}

// Управление
document.addEventListener("keydown", (event) => {
  if (isStarted) {
    if (event.code === "ArrowLeft" && snake.dx === 0) {
      snake.dx = -GRID;
      snake.dy = 0;
    } else if (event.code === "ArrowUp" && snake.dy === 0) {
      snake.dy = -GRID;
      snake.dx = 0;
    } else if (event.code === "ArrowRight" && snake.dx === 0) {
      snake.dx = GRID;
      snake.dy = 0;
    } else if (event.code === "ArrowDown" && snake.dy === 0) {
      snake.dy = GRID;
      snake.dx = 0;
    }
  } else {
    if (event.code == "Enter") {
      isStarted = true;
      document.querySelector(".snake").style.display = "block";
      document.querySelector(".info").style.display = "block";
      document.querySelector("#start-game").style.display = "none";
      gameOverBoard.style.display = "none";
      // Запуск игры
      clearInterval(timeInterval);
      timeInterval = setInterval(timer, 1000);
      newGame();
      loop();
    }
  }
});

// Уменьшение времени
function timer() {
  time--;
  timeCounter.innerHTML = `Времени осталось: ${time} секунд`;

  if (time <= 0) {
    document.querySelector(".snake").style.display = "none";
    document.querySelector(".info").style.display = "none";

    gameOverBoard.querySelector("#final-count").innerHTML = `Счёт: ${points}`;
    gameOverBoard.style.display = "block";

    recordScoreAndShowIt();

    isStarted = false;
  }
}

function newGame() {
  snake.x = 160;
  snake.y = 160;
  snake.cells = [];
  snake.maxCells = 4;
  snake.dx = GRID;
  snake.dy = 0;

  points = 0;
  time = DEFAULT_TIME;
  unspeed = DEFAULT_UNSPEED;
  pointsConter.innerHTML = "Очки: 0";

  canvas.style.backgroundColor = "black";

  apple.x = getRandomInt(0, 25) * GRID;
  apple.y = getRandomInt(0, 25) * GRID;
}

function recordScoreAndShowIt() {
  let storedData = localStorage.getItem("score");

  if (!storedData || storedData < points) {
    localStorage.setItem("score", points);
  }
  storedData = localStorage.getItem("score");
  document.querySelector("#record").innerHTML = `Ваш рекорд: ${storedData}`;
}
