// faqs
const modal = document.getElementById("rules");
const modal2 = document.getElementById("gameover");
const overlay = document.querySelectorAll(".overlay");
const newGame = document.getElementById("restart");

// select playing grid
const grid = document.querySelector(".grid");
// turn all grid squares into an array for future use
let squares = Array.from(document.querySelectorAll(".grid div"));
// select the score field for future use
const scoreDisplay = document.getElementById("score");
// select the start/pause button
const startBtn = document.getElementById("start-button");
const faq = document.getElementById("tutorial");
// width of playing grid
const width = 10;
// game speed
let timerId;

// next tetramino
const nextSquare = document.querySelectorAll(".mini-grid div");
const displayWidth = 4;
const displayIndex = 0;
let nextRandom = 0;
let score = 0;
const colors = ["orange", "red", "purple", "green", "blue"];

faq.addEventListener("click", () => {
  modal.classList.remove("hidden");
});
document.querySelector(".close").addEventListener("click", () => {
  modal.classList.add("hidden");
});
newGame.addEventListener("click", () => {
  document.location.reload();
});

// Tetrominoes

const lTetromino = [
  [1, width + 1, width * 2 + 1, 2],
  [width, width + 1, width + 2, width * 2 + 2],
  [1, width + 1, width * 2 + 1, width * 2],
  [width, width * 2, width * 2 + 1, width * 2 + 2],
];

const zTetromino = [
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
  [0, width, width + 1, width * 2 + 1],
  [width + 1, width + 2, width * 2, width * 2 + 1],
];

const tTetromino = [
  [1, width, width + 1, width + 2],
  [1, width + 1, width + 2, width * 2 + 1],
  [width, width + 1, width + 2, width * 2 + 1],
  [1, width, width + 1, width * 2 + 1],
];

const oTetromino = [
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
  [0, 1, width, width + 1],
];

const iTetromino = [
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
  [1, width + 1, width * 2 + 1, width * 3 + 1],
  [width, width + 1, width + 2, width + 3],
];

const theTetrominoes = [
  lTetromino,
  zTetromino,
  tTetromino,
  oTetromino,
  iTetromino,
];

let currentPosition = 3;
let currentRotation = 0;

// random tetramino
let random = Math.floor(Math.random() * theTetrominoes.length);
let random1 = Math.floor(Math.random() * 4);
let current = theTetrominoes[random][random1];

// drawing a tetramino

function draw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.add("tetromino");
    squares[currentPosition + index].style.backgroundColor = colors[random];
  });
}

// undraw a tetramino
function undraw() {
  current.forEach((index) => {
    squares[currentPosition + index].classList.remove("tetromino");
    squares[currentPosition + index].style.backgroundColor = "";
  });
}

// move the tetramino

// draw();
function moveDown() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

function freeze() {
  if (
    current.some((index) =>
      squares[currentPosition + index + width].classList.contains("taken")
    )
  ) {
    current.forEach((index) =>
      squares[currentPosition + index].classList.add("taken")
    );
    random = nextRandom;
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    random1 = Math.floor(Math.random() * 4);
    current = theTetrominoes[random][random1];
    currentPosition = 3;
    draw();
    displayTetromino();
    addScore();
    gameOver();
  }
}

// setting grid boundaries
function moveLeft() {
  undraw();
  const isAtLeftEdge = current.some(
    (index) => (currentPosition + index) % width === 0
  );

  if (!isAtLeftEdge) {
    currentPosition -= 1;
  }
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition += 1;
  }
  draw();
}

function moveRight() {
  undraw();
  const isAtRightEdge = current.some(
    (index) => (currentPosition + index) % width === width - 1
  );

  if (!isAtRightEdge) {
    currentPosition += 1;
  }
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    currentPosition -= 1;
  }
  draw();
}

function rotate() {
  undraw();
  currentRotation++;
  // once rotation is complete - 360 - go back to the original orientation
  if (currentRotation === current.length) {
    currentRotation = 0;
  }
  current = theTetrominoes[random][currentRotation];
  draw();
}

function fastDrop() {
  undraw();
  currentPosition += width;
  draw();
  freeze();
}

// assign keys for movement
function left(e) {
  if (e.keyCode === 37) {
    moveLeft();
  }
}
document.addEventListener("keyup", left);

function right(e) {
  if (e.keyCode === 39) {
    moveRight();
  }
}
document.addEventListener("keyup", right);

function change(e) {
  if (e.keyCode === 38 && scoreDisplay.innerHTML === "Game Over!") {
    console.log("The game is over, click start to start a new game!");
  } else if (e.keyCode === 38) {
    rotate();
  }
}
document.addEventListener("keyup", change);

function drop(e) {
  if (e.keyCode === 40 && scoreDisplay.innerHTML === "Game Over!") {
    console.log("The game is over, click start to start a new game!");
  } else if (e.keyCode === 40) {
    moveDown();
  }
}
document.addEventListener("keydown", drop);

// next tetromino preview, basic stance only - first item of each tetramino array

const nextTetromino = [
  [1, displayWidth + 1, displayWidth * 2 + 1, 2],
  [0, displayWidth, displayWidth + 1, displayWidth * 2 + 1],
  [1, displayWidth, displayWidth + 1, displayWidth + 2],
  [0, 1, displayWidth, displayWidth + 1],
  [1, displayWidth + 1, displayWidth * 2 + 1, displayWidth * 3 + 1],
];

// display next tetromino
function displayTetromino() {
  nextSquare.forEach((square) => {
    square.classList.remove("tetromino");
    square.style.backgroundColor = "";
  });
  nextTetromino[nextRandom].forEach((index) => {
    nextSquare[displayIndex + index].classList.add("tetromino");
    nextSquare[displayIndex + index].style.backgroundColor = colors[nextRandom];
  });
}

startBtn.addEventListener("click", () => {
  if (timerId) {
    clearInterval(timerId);
    timerId = null;
  } else {
    draw();
    timerId = setInterval(moveDown, 500);
    nextRandom = Math.floor(Math.random() * theTetrominoes.length);
    displayTetromino();
  }

  if (scoreDisplay.innerHTML === "Game Over!") {
    scoreDisplay.innerHTML = 0;
  }
});

// increase score
function addScore() {
  for (i = 0; i < 199; i += width) {
    const row = [
      i,
      i + 1,
      i + 2,
      i + 3,
      i + 4,
      i + 5,
      i + 6,
      i + 7,
      i + 8,
      i + 9,
    ];

    if (row.every((index) => squares[index].classList.contains("taken"))) {
      score += 10;
      scoreDisplay.innerHTML = score;
      row.forEach((index) => {
        squares[index].classList.remove("taken");
        squares[index].classList.remove("tetromino");
        squares[index].style.backgroundColor = "";
      });
      const squaresRemoved = squares.splice(i, width);
      squares = squaresRemoved.concat(squares);
      squares.forEach((cell) => grid.appendChild(cell));
    }
  }
}

function gameOver() {
  if (
    current.some((index) =>
      squares[currentPosition + index].classList.contains("taken")
    )
  ) {
    scoreDisplay.innerHTML = "Game Over!";
    clearInterval(timerId);
    modal2.classList.remove("hidden");
  }
}
