const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItemBox = document.querySelector(".tetris__nextItemBox");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");

const CENTER_POSITION_NUMBER = 5;

// 배열로 만들어 놨다가 추후에 random으로 currentBlockShape으로 값 넘겨주기
const blockShape = ["squre"];

let currentBlockArray;
// 임시로 squre.. 나중에 랜덤으로 바꾸자
let currentBlockShape = "squre";
let currentKeyPress;
let lastSavedBlockNumberArray;
let turn = true;
let interval;

function playGame(e) {
  // console.log(e);
  menu.style.display = "none";
  makeGameMap();
}

// 게임 시작 버튼을 누르면 게임 시작
// playingBtn.addEventListener("click", playGame);
makeGameMap();
inGamePlay();

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

function inGamePlay() {
  makeNewBlock();
  moveBlockDownPerSecond();
  keyPressHandler();
  blockSave();
}

function makeNewBlock(blockNumberArray) {
  // 네모 박스 만들기
  // 리팩토링 가능, 함수형으로 하나씩 분리
  if (currentBlockShape === "squre") return makeSqure(blockNumberArray);

  // 다른 모양 계속 만들기
}

function makeSqure(blockNumberArray) {
  makeSqureShape(blockNumberArray);
  paintBlock("red");

  // makeShape를 따로 빼서 재사용할 것이냐...
  function makeSqureShape(blockNumberArray) {
    const blockNumber = blockNumberArray
      ? blockNumberArray
      : [
          `${CENTER_POSITION_NUMBER}`,
          `${CENTER_POSITION_NUMBER + 1}`,
          `${CENTER_POSITION_NUMBER + 10}`,
          `${CENTER_POSITION_NUMBER + 11}`,
        ];
    console.log(blockNumber);
    currentBlockShape = "squre";
    currentBlockArray = blockNumber;
  }
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
    if (isArrowKeyPressed(e.key)) moveBlock();

    function isArrowKeyPressed(key) {
      currentKeyPress = key;
      console.log(key);
      return (
        currentKeyPress === "ArrowRight" ||
        currentKeyPress === "ArrowLeft" ||
        currentKeyPress === "ArrowUp" ||
        currentKeyPress === "ArrowDown"
      );
    }
  });
}

function moveBlock() {
  removeCurrentBlock();
  makeNewBlock(makeNewBlockNumberArray());
}

function removeCurrentBlock() {
  currentBlockArray.map((b) => {
    const miniBlock = document.querySelector(
      `.tetris__gridItem[data-id="${b}"]`
    );
    miniBlock.style.backgroundColor = "white";
  });
}

function makeNewBlockNumberArray() {
  console.log(currentKeyPress);
  console.log(canMove());
  if (currentBlockShape === "squre" && canMove()) {
    if (currentKeyPress === "ArrowRight")
      return currentBlockArray.map((b) => `${+b + 1}`);
    if (currentKeyPress === "ArrowLeft")
      return currentBlockArray.map((b) => `${+b - 1}`);

    if (currentKeyPress === "ArrowUp") return currentBlockArray;
    if (currentKeyPress === "ArrowDown")
      return currentBlockArray.map((b) => `${+b + 10}`);
  }
  return currentBlockArray;
}

function canMove() {
  // 추후에 블락들 추가될고 arrowup key에 따른 변화도 동일하다면... blockshape지우는 리팩토링
  return currentBlockShape === "squre" && canFutureBlockMove() ? true : false;

  function canFutureBlockMove() {
    const futureBlockArray = makeFutureBlockArray();
    return checkFutureBlockcanMove(futureBlockArray);

    function makeFutureBlockArray() {
      if (currentKeyPress === "ArrowLeft") {
        return currentBlockArray
          .map((b) => +b - 1)
          .filter((b) => !currentBlockArray.includes(`${b}`));
      }

      if (currentKeyPress === "ArrowRight") {
        return currentBlockArray
          .map((b) => +b + 1)
          .filter((b) => !currentBlockArray.includes(`${b}`));
      }

      if (currentKeyPress === "ArrowDown") {
        return currentBlockArray
          .map((b) => +b + 10)
          .filter((b) => !currentBlockArray.includes(`${b}`));
      }
    }

    function checkFutureBlockcanMove(futureBlockArray) {
      if (isFutureBlockOverGameMap(futureBlockArray)) {
        return false;
      }
      return canfutureBlockPainted(futureBlockArray);
    }

    function canfutureBlockPainted(futureBlockArray) {
      console.log(futureBlockArray);
      return !futureBlockArray.some((b) => alreadyBlockThere(b));
    }

    function alreadyBlockThere(futureBlock) {
      const futureBlockColor = window
        .getComputedStyle(
          document.querySelector(`.tetris__gridItem[data-id="${futureBlock}"]`)
        )
        .getPropertyValue("background-color");

      console.log(futureBlockColor);
      return futureBlockColor !== "rgb(255, 255, 255)";
    }
  }
}

function isFutureBlockOverGameMap(futureBlockArray) {
  return isBlockOnRightWall() || isBlockOnLeftWall() || isBlockOnBottomWall()
    ? true
    : false;

  function isBlockOnRightWall() {
    return (
      currentBlockArray.some((b) => b % 10 === 0) &&
      futureBlockArray.some((b) => b % 10 === 1)
    );
  }

  function isBlockOnLeftWall() {
    return (
      currentBlockArray.some((b) => b % 10 === 1) &&
      futureBlockArray.some((b) => b % 10 === 0)
    );
  }

  function isBlockOnBottomWall() {
    return futureBlockArray.some((b) => +b > 150);
  }
}

function moveBlockDownPerSecond() {
  interval = true;
  const setIntervalMoveBlockDown = setInterval(moveBlockDown, 1000);

  function moveBlockDown() {
    currentKeyPress = "ArrowDown";
    !canMove() ? clearIntervalMoveBlockDown() : moveBlock();
  }

  function clearIntervalMoveBlockDown() {
    clearInterval(setIntervalMoveBlockDown);
    interval = false;
    turn = false;
  }
}

function blockSave() {
  console.log(interval);
  const setIntervalCheckMovingBlock = setInterval(checkMovingBlock, 1000);

  function checkMovingBlock() {
    if (!interval && !turn) {
      clearInterval(setIntervalCheckMovingBlock);
      // blocktype을 여기서 바꿀게끔..
      // currentBlockShape = '';
      turn = true;
      lastSavedBlockNumberArray = currentBlockArray;

      makeNewBlock();
      moveBlockDownPerSecond();
      // keyPressHandler();          ******* keyPressHandler가 한번 이상 설정되면 두번적용되서 두칸이 이동함 주의*******
      blockSave();
      removefullColorLine();
      // **************** canMove에 색칠된 박스가 바로 밑에 있으면 false를 return하게 끔 만들어야 함 그래야 누적이 됨 ***********************
    }
  }
}

function removefullColorLine() {
  const blockLine = getBlockLine();
  let blockLineState = getStateOfBlockLineColor(blockLine);
  console.log(blockLineState);
  removeBlockLineFullOfColor(blockLineState);

  // moveEntireblockToDown(); 만들어야 할 기능 따로 배서 함수로 사용하게 하자

  function getBlockLine() {
    console.log(lastSavedBlockNumberArray);
    let result = lastSavedBlockNumberArray
      .map((b) => (b / 10 === 0 ? 0 : Math.floor(b / 10)))
      .filter((b) => b < 15);

    console.log(result);
    return [...new Set(result)];
  }

  function getStateOfBlockLineColor(blockLine) {
    const result = [];
    blockLine.map((bl) => {
      const blockLineNumberArray = [];
      console.log(blockLineNumberArray);
      console.log(bl);
      for (let i = 1; i < 11; i++) {
        blockLineNumberArray.push(bl !== 0 ? bl * 10 + i : 11 - i);
      }
      console.log(blockLineNumberArray);
      const isfull = CheckFullColorLine(blockLineNumberArray);
      result.push({
        blockLine: `${bl}`,
        full: `${isfull}`,
        blockLineNumberArray,
      });
    });
    return result;
  }

  function CheckFullColorLine(NumberArray) {
    return !NumberArray.some((b) => isWhiteBlock(b));
  }

  function isWhiteBlock(blockNumber) {
    const BlockColor = window
      .getComputedStyle(
        document.querySelector(`.tetris__gridItem[data-id="${blockNumber}"]`)
      )
      .getPropertyValue("background-color");

    return BlockColor === "rgb(255, 255, 255)";
  }

  function removeBlockLineFullOfColor(blockLineState) {
    blockLineState.map((block) => {
      console.log(block);
      if (block.full === "true") {
        removeBlockLine(block.blockLineNumberArray);
      }
    });
  }

  function removeBlockLine(numberArray) {
    numberArray.map((b) => {
      document.querySelector(
        `.tetris__gridItem[data-id="${b}"]`
      ).style.backgroundColor = "white";
    });
  }
}
