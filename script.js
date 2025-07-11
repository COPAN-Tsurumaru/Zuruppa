
const canvas = document.getElementById("puzzleCanvas");
const ctx = canvas.getContext("2d");
const input = document.getElementById("imageInput");
const message = document.getElementById("clearMessage");

const size = 512;
const grid = 4;
const tileSize = size / grid;

let image = null;
let tiles = [];
let draggingTile = null;

input.addEventListener("change", handleImage, false);
canvas.addEventListener("mousedown", onMouseDown);
canvas.addEventListener("mouseup", onMouseUp);

function handleImage(e) {
  const reader = new FileReader();
  reader.onload = function (event) {
    image = new Image();
    image.onload = function () {
      initTiles();
      drawTiles();
    };
    image.src = event.target.result;
  };
  reader.readAsDataURL(e.target.files[0]);
}

function initTiles() {
  tiles = [];
  for (let y = 0; y < grid; y++) {
    for (let x = 0; x < grid; x++) {
      tiles.push({ x, y, correctX: x, correctY: y });
    }
  }
  shuffle(tiles);
}

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function drawTiles() {
  ctx.clearRect(0, 0, size, size);
  tiles.forEach(tile => {
    ctx.drawImage(
      image,
      tile.correctX * tileSize, tile.correctY * tileSize, tileSize, tileSize,
      tile.x * tileSize, tile.y * tileSize, tileSize, tileSize
    );
    ctx.strokeStyle = "#000";
    ctx.strokeRect(tile.x * tileSize, tile.y * tileSize, tileSize, tileSize);
  });
}

function getTileAt(x, y) {
  return tiles.find(tile => {
    return (
      x >= tile.x * tileSize &&
      x < (tile.x + 1) * tileSize &&
      y >= tile.y * tileSize &&
      y < (tile.y + 1) * tileSize
    );
  });
}

function onMouseDown(e) {
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  draggingTile = getTileAt(x, y);
}

function onMouseUp(e) {
  if (!draggingTile) return;
  const rect = canvas.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;
  const targetTile = getTileAt(x, y);
  if (targetTile && draggingTile !== targetTile) {
    const temp = { x: draggingTile.x, y: draggingTile.y };
    draggingTile.x = targetTile.x;
    draggingTile.y = targetTile.y;
    targetTile.x = temp.x;
    targetTile.y = temp.y;
    drawTiles();
    checkClear();
  }
  draggingTile = null;
}

function checkClear() {
  const isClear = tiles.every(tile => tile.x === tile.correctX && tile.y === tile.correctY);
  if (isClear) {
    message.style.display = "block";
  }
}
