const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItemBox = document.querySelector(".tetris__nextItemBox");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");

const CENTERNUMBER = 5;

let currentBlockArray;
// 임시로 squre.. 나중에 랜덤으로 바꾸자
let currentBlockShape = "squre";
let currentKeyPress;

function playGame(e) {
  // console.log(e);
  menu.style.display = "none";
  makeGameMap();
}

// 게임 시작 버튼을 누르면 게임 시작
// playingBtn.addEventListener("click", playGame);
makeGameMap();
makeNewBlock();
keyPressHandler();

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

function makeNewBlock(blockNumberArray) {
  // 네모 박스 만들기
  // 리팩토링 가능, 함수형으로 하나씩 분리
  if (currentBlockShape === "squre") return makeSqure(blockNumberArray);

  // 다른 모양 계속 만들기
}

function makeSqure(blockNumberArray) {
  const blockNumber = blockNumberArray
    ? blockNumberArray
    : [
        `${CENTERNUMBER}`,
        `${CENTERNUMBER + 1}`,
        `${CENTERNUMBER + 10}`,
        `${CENTERNUMBER + 11}`,
      ];
  console.log(blockNumber);
  currentBlockShape = "squre";
  currentBlockArray = blockNumber;
  paintBlock("red");
}

function paintBlock(color) {
  currentBlockArray.map((item) => {
    const miniBlock = document.querySelector(
      `.tetris__gridItem[data-id="${item}"]`
    );
    miniBlock.style.backgroundColor = `${color}`;
  });
}

function keyPressHandler() {
  window.addEventListener("keydown", (e) => {
    // key들이 arrow우 일때만 코드가 적용되게 설정해야
    console.log(e.key);
    currentKeyPress = e.key;
    if (
      currentKeyPress === "ArrowRight" ||
      currentKeyPress === "ArrowLeft" ||
      currentKeyPress === "ArrowUp" ||
      currentKeyPress === "ArrowDown"
    ) {
      moveBlock();
    }
  });
}

function moveBlock() {
  const newBlockNumberArray = makeNewBlockNumberArray();
  console.log(newBlockNumberArray);

  // if (newBlockNumberArray) {
  removeCurrentBlock();
  makeNewBlock(newBlockNumberArray);
  // }
}

function makeNewBlockNumberArray() {
  console.log(currentKeyPress);
  console.log(canMove());
  if (currentBlockShape === "squre") {
    if (currentKeyPress === "ArrowRight" && canMove())
      return currentBlockArray.map((b) => `${+b + 1}`);
    if (currentKeyPress === "ArrowLeft" && canMove())
      return currentBlockArray.map((b) => `${+b - 1}`);
    // 잠시 위쪽키 봉인 중 추후 고치기
    if (currentKeyPress === "ArrowUp" && canMove()) return currentBlockArray;
    if (currentKeyPress === "ArrowDown" && canMove())
      return currentBlockArray.map((b) => `${+b + 10}`);
  }
  return currentBlockArray;
}

function canMove() {
  if (currentBlockShape === "squre") {
    const firstDigitString = getLastDigitString();
    console.log(firstDigitString);

    if (currentKeyPress === "ArrowRight")
      return firstDigitString === "9090" ? false : true;
    if (currentKeyPress === "ArrowLeft")
      return firstDigitString === "1212" ? false : true;

    const FirstTwoDigitString = getFirstTwoDigitString();
    console.log(FirstTwoDigitString);
    if (currentKeyPress === "ArrowDown")
      return FirstTwoDigitString === "13131414" ||
        FirstTwoDigitString === "13141415"
        ? false
        : true;
  }
}

function getLastDigitString() {
  return (firstDigitString = currentBlockArray
    .map((b) => +b % 10)
    .reduce((string, b) => (string += b), ""));
}

function getFirstTwoDigitString() {
  return currentBlockArray
    .map((b) => Math.floor(+b / 10))
    .reduce((string, b) => (string += b), "");
}

function removeCurrentBlock() {
  currentBlockArray.map((b) => {
    const miniBlock = document.querySelector(
      `.tetris__gridItem[data-id="${b}"]`
    );
    miniBlock.style.backgroundColor = "white";
  });
}
