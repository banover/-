const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItemBox = document.querySelector(".tetris__nextItemBox");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");

const CENTERNUMBER = 5;

let currentBlock;
let currentBlockShape;

function playGame(e) {
  // console.log(e);
  menu.style.display = "none";
  makeGameMap();
}

// 게임 시작 버튼을 누르면 게임 시작
// playingBtn.addEventListener("click", playGame);
makeGameMap();
currentBlock = makeBlock("squre");

// **********************************************************************
// 여기서부터는 함수
// **********************************************************************

function makeGameMap() {
  for (let i = 0; i < 150; i++) {
    const gridCell = document.createElement("div");
    gridCell.classList.add("tetris__gridItem");
    gridCell.setAttribute("data-id", i + 1);
    playingBox.append(gridCell);
  }
}

function makeBlock(blockType, blockNumberArray) {
  // 네모 박스 만들기
  if (blockType === "squre") {
    const blockNumber = blockNumberArray
      ? blockNumberArray
      : [
          `${CENTERNUMBER}`,
          `${CENTERNUMBER + 1}`,
          `${CENTERNUMBER + 10}`,
          `${CENTERNUMBER + 11}`,
        ];
    console.log(blockNumber);

    blockNumber.map((item) => {
      const miniBlock = document.querySelector(
        `.tetris__gridItem[data-id="${item}"]`
      );
      miniBlock.style.backgroundColor = "red";
    });

    return blockNumber;
  }
  // 다른 모양 계속 만들기
}

window.addEventListener("keydown", (e) => {
  if (e.key === "ArrowRight") {
    // 새로운 blockNumber
    const newBlockNumber = makeNewBlockNumberArray("squre", e.key);
    console.log(newBlockNumber);
    // 새롭게 색칠한 block 추가
    movingBlock(currentBlock, newBlockNumber);
  }
});

function makeNewBlockNumberArray(blockType, pressKey) {
  console.log(pressKey);
  if (blockType === "squre") {
    if (pressKey === "ArrowRight") return currentBlock.map((b) => `${+b + 1}`);
  }
}

function movingBlock(currentBlockNumber, newBlockNumber) {
  removeBlock(currentBlockNumber);
  currentBlock = makeBlock("squre", newBlockNumber);
}

function removeBlock(blockArray) {
  blockArray.map((b) => {
    const miniBlock = document.querySelector(
      `.tetris__gridItem[data-id="${b}"]`
    );
    miniBlock.style.backgroundColor = "white";
  });
}
