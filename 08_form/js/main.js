"use strict";

/*
  defer 속성을 사용했기 때문에
  HTML 요소가 모두 생성된 다음 코드가 실행됩니다.
*/


/* ====================================
   HTML 요소 가져오기
==================================== */

const gameCanvas = document.getElementById("gameCanvas");
const gameContext = gameCanvas.getContext("2d");

const nextCanvas = document.getElementById("nextCanvas");
const nextContext = nextCanvas.getContext("2d");

const scoreElement = document.getElementById("score");
const levelElement = document.getElementById("level");
const linesElement = document.getElementById("lines");
const topLinesElement = document.getElementById("topLines");
const bestScoreElement = document.getElementById("bestScore");

const gameOverlay = document.getElementById("gameOverlay");
const pauseOverlay = document.getElementById("pauseOverlay");

const overlayTitle = document.getElementById("overlayTitle");
const overlayMessage = document.getElementById("overlayMessage");
const overlayStartButton = document.getElementById("overlayStartButton");

const startButton = document.getElementById("startButton");
const pauseButton = document.getElementById("pauseButton");
const resetButton = document.getElementById("resetButton");


/* ====================================
   게임 기본 설정
==================================== */

const COLUMN_COUNT = 10;
const ROW_COUNT = 20;
const BLOCK_SIZE = 30;

const PIECE_COLORS = {
  I: "#20d7e8",
  J: "#265bdc",
  L: "#ef731b",
  O: "#ffd52b",
  S: "#4bc437",
  T: "#8e3fd0",
  Z: "#e82f27"
};

const PIECES = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ],

  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],

  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0]
  ],

  O: [
    [1, 1],
    [1, 1]
  ],

  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0]
  ],

  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0]
  ],

  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0]
  ]
};

const PIECE_NAMES = Object.keys(PIECES);


/* ====================================
   게임 상태
==================================== */

let board = createBoard();

let currentPiece = null;
let nextPiece = null;

let score = 0;
let totalLines = 0;
let level = 1;
let bestScore = loadBestScore();

let gameStarted = false;
let gamePaused = false;
let gameEnded = false;

let dropCounter = 0;
let dropInterval = 800;
let lastTime = 0;
let animationId = null;


/* ====================================
   최고 점수 저장
==================================== */

function loadBestScore() {
  try {
    const savedScore = localStorage.getItem("retroTetrisBestScore");

    return savedScore ? Number(savedScore) : 0;
  } catch (error) {
    return 0;
  }
}

function saveBestScore() {
  try {
    localStorage.setItem(
      "retroTetrisBestScore",
      String(bestScore)
    );
  } catch (error) {
    /*
      localStorage 사용이 제한된 환경에서도
      게임은 계속 실행됩니다.
    */
  }
}


/* ====================================
   게임판 생성
==================================== */

function createBoard() {
  return Array.from(
    { length: ROW_COUNT },
    function () {
      return Array(COLUMN_COUNT).fill(null);
    }
  );
}


/* ====================================
   블록 생성
==================================== */

function createRandomPiece() {
  const randomIndex = Math.floor(
    Math.random() * PIECE_NAMES.length
  );

  const name = PIECE_NAMES[randomIndex];

  return {
    name: name,

    matrix: PIECES[name].map(function (row) {
      return row.slice();
    }),

    color: PIECE_COLORS[name],

    x: 0,
    y: 0
  };
}

function setStartPosition(piece) {
  piece.x = Math.floor(
    (COLUMN_COUNT - piece.matrix[0].length) / 2
  );

  piece.y = piece.name === "I" ? -1 : 0;
}

function spawnPiece() {
  if (nextPiece === null) {
    nextPiece = createRandomPiece();
  }

  currentPiece = nextPiece;
  nextPiece = createRandomPiece();

  setStartPosition(currentPiece);
  drawNextPiece();

  if (hasCollision(currentPiece, 0, 0, currentPiece.matrix)) {
    finishGame();
  }
}


/* ====================================
   충돌 검사
==================================== */

function hasCollision(
  piece,
  offsetX,
  offsetY,
  testMatrix
) {
  const matrix = testMatrix || piece.matrix;

  for (let y = 0; y < matrix.length; y += 1) {
    for (let x = 0; x < matrix[y].length; x += 1) {

      if (matrix[y][x] === 0) {
        continue;
      }

      const newX = piece.x + x + offsetX;
      const newY = piece.y + y + offsetY;

      if (newX < 0 || newX >= COLUMN_COUNT) {
        return true;
      }

      if (newY >= ROW_COUNT) {
        return true;
      }

      if (
        newY >= 0 &&
        board[newY][newX] !== null
      ) {
        return true;
      }
    }
  }

  return false;
}


/* ====================================
   게임 조작 가능 상태 확인
==================================== */

function canControlPiece() {
  return (
    gameStarted === true &&
    gamePaused === false &&
    gameEnded === false &&
    currentPiece !== null
  );
}


/* ====================================
   블록 좌우 이동
==================================== */

function movePiece(direction) {
  if (!canControlPiece()) {
    return;
  }

  if (!hasCollision(currentPiece, direction, 0)) {
    currentPiece.x += direction;
  }

  drawGame();
}


/* ====================================
   블록 아래 이동
==================================== */

function movePieceDown(addDropScore) {
  if (!canControlPiece()) {
    return;
  }

  if (!hasCollision(currentPiece, 0, 1)) {
    currentPiece.y += 1;

    if (addDropScore === true) {
      score += 1;
      updateScoreBoard();
    }
  } else {
    lockCurrentPiece();
  }

  dropCounter = 0;
  drawGame();
}


/* ====================================
   블록 즉시 내리기
==================================== */

function hardDrop() {
  if (!canControlPiece()) {
    return;
  }

  let movedBlocks = 0;

  while (!hasCollision(currentPiece, 0, 1)) {
    currentPiece.y += 1;
    movedBlocks += 1;
  }

  score += movedBlocks * 2;

  lockCurrentPiece();
  updateScoreBoard();
  drawGame();
}


/* ====================================
   블록 회전
==================================== */

function rotateMatrix(matrix) {
  return matrix[0].map(function (_, columnIndex) {
    return matrix
      .map(function (row) {
        return row[columnIndex];
      })
      .reverse();
  });
}

function rotateCurrentPiece() {
  if (!canControlPiece()) {
    return;
  }

  if (currentPiece.name === "O") {
    return;
  }

  const rotatedMatrix = rotateMatrix(currentPiece.matrix);
  const wallKickPositions = [0, -1, 1, -2, 2];

  for (
    let index = 0;
    index < wallKickPositions.length;
    index += 1
  ) {
    const offsetX = wallKickPositions[index];

    if (
      !hasCollision(
        currentPiece,
        offsetX,
        0,
        rotatedMatrix
      )
    ) {
      currentPiece.x += offsetX;
      currentPiece.matrix = rotatedMatrix;

      drawGame();
      return;
    }
  }
}


/* ====================================
   블록 게임판에 고정
==================================== */

function lockCurrentPiece() {
  let blockAboveBoard = false;

  currentPiece.matrix.forEach(function (row, matrixY) {
    row.forEach(function (value, matrixX) {

      if (value === 0) {
        return;
      }

      const boardX = currentPiece.x + matrixX;
      const boardY = currentPiece.y + matrixY;

      if (boardY < 0) {
        blockAboveBoard = true;
        return;
      }

      board[boardY][boardX] = {
        color: currentPiece.color,
        name: currentPiece.name
      };
    });
  });

  if (blockAboveBoard === true) {
    finishGame();
    return;
  }

  removeCompletedLines();
  spawnPiece();
}


/* ====================================
   완성된 가로줄 제거
==================================== */

function removeCompletedLines() {
  let removedLines = 0;

  for (
    let y = ROW_COUNT - 1;
    y >= 0;
    y -= 1
  ) {
    const completeLine = board[y].every(function (cell) {
      return cell !== null;
    });

    if (completeLine === true) {
      board.splice(y, 1);
      board.unshift(Array(COLUMN_COUNT).fill(null));

      removedLines += 1;

      /*
        현재 줄이 제거된 후 위의 줄이 내려오기 때문에
        같은 y 위치를 다시 검사합니다.
      */
      y += 1;
    }
  }

  if (removedLines === 0) {
    return;
  }

  const scoreTable = {
    1: 100,
    2: 300,
    3: 500,
    4: 800
  };

  score += scoreTable[removedLines] * level;
  totalLines += removedLines;

  level = Math.floor(totalLines / 10) + 1;

  dropInterval = Math.max(
    100,
    800 - ((level - 1) * 65)
  );

  updateScoreBoard();
}


/* ====================================
   점수 화면 갱신
==================================== */

function formatNumber(number, length) {
  return String(number).padStart(length, "0");
}

function updateScoreBoard() {
  scoreElement.textContent = formatNumber(score, 6);
  levelElement.textContent = formatNumber(level, 2);
  linesElement.textContent = formatNumber(totalLines, 3);
  topLinesElement.textContent = formatNumber(totalLines, 3);
  bestScoreElement.textContent = formatNumber(bestScore, 6);
}


/* ====================================
   게임 화면 초기화
==================================== */

function clearGameCanvas() {
  gameContext.clearRect(
    0,
    0,
    gameCanvas.width,
    gameCanvas.height
  );

  gameContext.fillStyle = "#050505";

  gameContext.fillRect(
    0,
    0,
    gameCanvas.width,
    gameCanvas.height
  );
}


/* ====================================
   게임 격자선
==================================== */

function drawGrid() {
  gameContext.strokeStyle = "rgba(100, 100, 110, 0.28)";
  gameContext.lineWidth = 1;

  for (
    let column = 0;
    column <= COLUMN_COUNT;
    column += 1
  ) {
    gameContext.beginPath();

    gameContext.moveTo(
      column * BLOCK_SIZE,
      0
    );

    gameContext.lineTo(
      column * BLOCK_SIZE,
      gameCanvas.height
    );

    gameContext.stroke();
  }

  for (
    let row = 0;
    row <= ROW_COUNT;
    row += 1
  ) {
    gameContext.beginPath();

    gameContext.moveTo(
      0,
      row * BLOCK_SIZE
    );

    gameContext.lineTo(
      gameCanvas.width,
      row * BLOCK_SIZE
    );

    gameContext.stroke();
  }
}


/* ====================================
   블록 한 칸 그리기
==================================== */

function drawBlock(
  context,
  pixelX,
  pixelY,
  size,
  color,
  opacity
) {
  context.save();

  context.globalAlpha = opacity;

  /*
    블록 본체
  */
  context.fillStyle = color;

  context.fillRect(
    pixelX + 2,
    pixelY + 2,
    size - 4,
    size - 4
  );

  /*
    윗부분 밝은 픽셀 효과
  */
  context.fillStyle = "rgba(255,255,255,0.45)";

  context.fillRect(
    pixelX + 4,
    pixelY + 4,
    size - 8,
    4
  );

  /*
    왼쪽 밝은 효과
  */
  context.fillStyle = "rgba(255,255,255,0.25)";

  context.fillRect(
    pixelX + 4,
    pixelY + 4,
    4,
    size - 8
  );

  /*
    아래쪽 그림자 효과
  */
  context.fillStyle = "rgba(0,0,0,0.35)";

  context.fillRect(
    pixelX + 5,
    pixelY + size - 8,
    size - 10,
    4
  );

  /*
    테두리
  */
  context.strokeStyle = "rgba(0,0,0,0.8)";
  context.lineWidth = 2;

  context.strokeRect(
    pixelX + 2,
    pixelY + 2,
    size - 4,
    size - 4
  );

  /*
    중앙 작은 반짝임
  */
  context.fillStyle = "rgba(255,255,255,0.55)";

  context.fillRect(
    pixelX + Math.floor(size / 2) - 1,
    pixelY + Math.floor(size / 2) - 1,
    3,
    3
  );

  context.restore();
}


/* ====================================
   고정된 게임판 그리기
==================================== */

function drawBoard() {
  for (let y = 0; y < ROW_COUNT; y += 1) {
    for (let x = 0; x < COLUMN_COUNT; x += 1) {

      const cell = board[y][x];

      if (cell !== null) {
        drawBlock(
          gameContext,
          x * BLOCK_SIZE,
          y * BLOCK_SIZE,
          BLOCK_SIZE,
          cell.color,
          1
        );
      }
    }
  }
}


/* ====================================
   현재 블록 그리기
==================================== */

function drawCurrentPiece() {
  if (currentPiece === null) {
    return;
  }

  currentPiece.matrix.forEach(function (row, matrixY) {
    row.forEach(function (value, matrixX) {

      if (value === 0) {
        return;
      }

      const drawX =
        (currentPiece.x + matrixX) * BLOCK_SIZE;

      const drawY =
        (currentPiece.y + matrixY) * BLOCK_SIZE;

      if (drawY >= 0) {
        drawBlock(
          gameContext,
          drawX,
          drawY,
          BLOCK_SIZE,
          currentPiece.color,
          1
        );
      }
    });
  });
}


/* ====================================
   고스트 블록 위치
==================================== */

function getGhostPositionY() {
  let ghostY = currentPiece.y;

  while (
    !hasCollision(
      {
        x: currentPiece.x,
        y: ghostY,
        matrix: currentPiece.matrix
      },
      0,
      1,
      currentPiece.matrix
    )
  ) {
    ghostY += 1;
  }

  return ghostY;
}


/* ====================================
   고스트 블록 그리기
==================================== */

function drawGhostPiece() {
  if (currentPiece === null) {
    return;
  }

  const ghostY = getGhostPositionY();

  currentPiece.matrix.forEach(function (row, matrixY) {
    row.forEach(function (value, matrixX) {

      if (value === 0) {
        return;
      }

      const drawX =
        (currentPiece.x + matrixX) * BLOCK_SIZE;

      const drawY =
        (ghostY + matrixY) * BLOCK_SIZE;

      if (drawY >= 0) {
        drawBlock(
          gameContext,
          drawX,
          drawY,
          BLOCK_SIZE,
          currentPiece.color,
          0.2
        );
      }
    });
  });
}


/* ====================================
   전체 게임 화면 그리기
==================================== */

function drawGame() {
  clearGameCanvas();
  drawGrid();
  drawBoard();
  drawGhostPiece();
  drawCurrentPiece();
}


/* ====================================
   다음 블록 그리기
==================================== */

function drawNextPiece() {
  nextContext.clearRect(
    0,
    0,
    nextCanvas.width,
    nextCanvas.height
  );

  nextContext.fillStyle = "#050505";

  nextContext.fillRect(
    0,
    0,
    nextCanvas.width,
    nextCanvas.height
  );

  if (nextPiece === null) {
    return;
  }

  const nextBlockSize = 24;

  const pieceWidth =
    nextPiece.matrix[0].length * nextBlockSize;

  const pieceHeight =
    nextPiece.matrix.length * nextBlockSize;

  const startX =
    (nextCanvas.width - pieceWidth) / 2;

  const startY =
    (nextCanvas.height - pieceHeight) / 2;

  nextPiece.matrix.forEach(function (row, y) {
    row.forEach(function (value, x) {

      if (value === 0) {
        return;
      }

      drawBlock(
        nextContext,
        startX + (x * nextBlockSize),
        startY + (y * nextBlockSize),
        nextBlockSize,
        nextPiece.color,
        1
      );
    });
  });
}


/* ====================================
   자동 낙하
==================================== */

function automaticDrop() {
  if (!canControlPiece()) {
    return;
  }

  if (!hasCollision(currentPiece, 0, 1)) {
    currentPiece.y += 1;
  } else {
    lockCurrentPiece();
  }

  dropCounter = 0;
}


/* ====================================
   게임 반복 실행
==================================== */

function gameLoop(currentTime) {
  if (gameStarted === false || gameEnded === true) {
    return;
  }

  if (lastTime === 0) {
    lastTime = currentTime;
  }

  const deltaTime = currentTime - lastTime;
  lastTime = currentTime;

  if (gamePaused === false) {
    dropCounter += deltaTime;

    if (dropCounter >= dropInterval) {
      automaticDrop();
    }

    drawGame();
  }

  animationId = requestAnimationFrame(gameLoop);
}


/* ====================================
   게임 시작
==================================== */

function startGame() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  board = createBoard();

  currentPiece = null;
  nextPiece = null;

  score = 0;
  totalLines = 0;
  level = 1;

  dropCounter = 0;
  dropInterval = 800;
  lastTime = 0;

  gameStarted = true;
  gamePaused = false;
  gameEnded = false;

  gameOverlay.classList.add("hidden");
  pauseOverlay.classList.add("hidden");

  pauseButton.disabled = false;
  pauseButton.textContent = "PAUSE";

  nextPiece = createRandomPiece();
  spawnPiece();

  updateScoreBoard();
  drawGame();

  animationId = requestAnimationFrame(gameLoop);
}


/* ====================================
   게임 일시정지
==================================== */

function togglePause() {
  if (gameStarted === false || gameEnded === true) {
    return;
  }

  gamePaused = !gamePaused;

  if (gamePaused === true) {
    pauseOverlay.classList.remove("hidden");
    pauseButton.textContent = "CONTINUE";
  } else {
    pauseOverlay.classList.add("hidden");
    pauseButton.textContent = "PAUSE";

    /*
      일시정지 시간만큼 블록이 갑자기 떨어지지 않도록
      시간을 다시 설정합니다.
    */
    lastTime = performance.now();
  }
}


/* ====================================
   게임 종료
==================================== */

function finishGame() {
  gameStarted = false;
  gamePaused = false;
  gameEnded = true;

  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  if (score > bestScore) {
    bestScore = score;
    saveBestScore();
  }

  updateScoreBoard();

  overlayTitle.textContent = "GAME OVER";

  overlayMessage.innerHTML =
    "SCORE : " +
    formatNumber(score, 6) +
    "<br>START 버튼을 눌러 다시 시작하세요.";

  overlayStartButton.textContent = "RESTART";

  gameOverlay.classList.remove("hidden");
  pauseOverlay.classList.add("hidden");

  pauseButton.disabled = true;
}


/* ====================================
   게임 초기 화면으로 리셋
==================================== */

function resetGame() {
  if (animationId !== null) {
    cancelAnimationFrame(animationId);
  }

  board = createBoard();

  currentPiece = null;
  nextPiece = null;

  score = 0;
  totalLines = 0;
  level = 1;

  dropCounter = 0;
  dropInterval = 800;
  lastTime = 0;

  gameStarted = false;
  gamePaused = false;
  gameEnded = false;

  overlayTitle.textContent = "TETRIS";

  overlayMessage.innerHTML =
    "START 버튼을 눌러<br>게임을 시작하세요.";

  overlayStartButton.textContent = "START";

  gameOverlay.classList.remove("hidden");
  pauseOverlay.classList.add("hidden");

  pauseButton.disabled = true;
  pauseButton.textContent = "PAUSE";

  updateScoreBoard();
  drawGame();
  drawNextPiece();
}


/* ====================================
   시작·정지·리셋 버튼
==================================== */

overlayStartButton.addEventListener("click", function () {
  startGame();
});

startButton.addEventListener("click", function () {
  startGame();
});

pauseButton.addEventListener("click", function () {
  togglePause();
});

resetButton.addEventListener("click", function () {
  resetGame();
});


/* ====================================
   키보드 조작
==================================== */

document.addEventListener("keydown", function (event) {
  const preventedKeys = [
    "ArrowLeft",
    "ArrowRight",
    "ArrowUp",
    "ArrowDown",
    "Space"
  ];

  if (
    preventedKeys.includes(event.key) ||
    event.code === "Space"
  ) {
    event.preventDefault();
  }

  if (
    event.key === "p" ||
    event.key === "P" ||
    event.key === "Escape"
  ) {
    togglePause();
    return;
  }

  if (!canControlPiece()) {
    return;
  }

  switch (event.key) {
    case "ArrowLeft":
      movePiece(-1);
      break;

    case "ArrowRight":
      movePiece(1);
      break;

    case "ArrowDown":
      movePieceDown(true);
      break;

    case "ArrowUp":
      rotateCurrentPiece();
      break;

    default:
      break;
  }

  if (event.code === "Space") {
    hardDrop();
  }
});


/* ====================================
   모바일 조작 버튼
==================================== */

const mobileButtons =
  document.querySelectorAll(".mobile-button");

mobileButtons.forEach(function (button) {
  button.addEventListener("pointerdown", function (event) {
    event.preventDefault();

    const action = button.dataset.action;

    switch (action) {
      case "left":
        movePiece(-1);
        break;

      case "right":
        movePiece(1);
        break;

      case "rotate":
        rotateCurrentPiece();
        break;

      case "down":
        movePieceDown(true);
        break;

      case "drop":
        hardDrop();
        break;

      default:
        break;
    }
  });
});


/* ====================================
   첫 화면 표시
==================================== */

updateScoreBoard();
drawGame();
drawNextPiece();