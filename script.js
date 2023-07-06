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
let maxHeightBlockLine = 14;
let removedBlockLine = [];
let blockColorArray = [];
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
  if (currentBlockShape === "blockLine") return makeBlockLine(blockNumberArray);

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

function makeBlockLine(blockNumberArray) {
  // currentBlockArray을 가져오기 까지는 성공 하지만, 색을 칠해야함, 미리 만들어 둔 것은 다 색칠하는 함수임..
  paintBlockLine("red");
  console.log("makeblockline 진입성공");
  console.log(blockNumberArray);

  function paintBlockLine() {
    blockNumberArray.map((item, index) => {
      const miniBlock = document.querySelector(
        `.tetris__gridItem[data-id="${item}"]`
      );
      miniBlock.style.backgroundColor = blockColorArray[index];
    });
    // blockColorArray = [];
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
  console.log("removeCurrentBlock 진입");
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

  if (currentBlockShape === "blockLine" && canMove()) {
    if (currentKeyPress === "ArrowDown")
      console.log("makeNewBlockNumberArray 진입성공");
    return currentBlockArray.map((b) => `${+b + 10}`);
  }
  return currentBlockArray;
}

function canMove() {
  console.log("canMove 진입");
  // 추후에 블락들 추가될고 arrowup key에 따른 변화도 동일하다면... blockshape지우는 리팩토링
  // return currentBlockShape === "squre" && canFutureBlockMove() ? true : false;

  if (currentBlockShape === "squre" && canFutureBlockMove()) return true;
  if (currentBlockShape === "blockLine" && canFutureBlockMove()) return true;
  return false;

  function canFutureBlockMove() {
    console.log("canFutureBlockMove진입");
    const futureBlockArray = makeFutureBlockArray();
    return checkFutureBlockcanMove(futureBlockArray);

    // function makeFutureBlockArray() {
    //   if (currentKeyPress === "ArrowLeft") {
    //     return currentBlockArray
    //       .map((b) => +b - 1)
    //       .filter((b) => !currentBlockArray.includes(`${b}`));
    //   }

    //   if (currentKeyPress === "ArrowRight") {
    //     return currentBlockArray
    //       .map((b) => +b + 1)
    //       .filter((b) => !currentBlockArray.includes(`${b}`));
    //   }

    //   if (currentKeyPress === "ArrowDown") {
    //     return currentBlockArray
    //       .map((b) => +b + 10)
    //       .filter((b) => !currentBlockArray.includes(`${b}`));
    //   }
    // }

    function checkFutureBlockcanMove(futureBlockArray) {
      console.log("checkFutureBlockcanMove진입");
      if (currentBlockShape === "blockLine") {
        return canfutureBlockPainted(futureBlockArray);
      }

      if (isFutureBlockOverGameMap(futureBlockArray)) {
        return false;
      }
      return canfutureBlockPainted(futureBlockArray);
    }

    function canfutureBlockPainted(futureBlockArray) {
      console.log("canfutureBlockPainted진입");

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
    console.log("makeFutureBlockArray진입");
    console.log(currentBlockArray);

    return currentBlockArray
      .map((b) => +b + 10)
      .filter((b) => !currentBlockArray.includes(`${b}`));
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
  // setInterval에 대해 고민해 보자!! 버그가 있다.
  // 내 생각에는 current방향 설정하지 말고 고정시키고 move down시켜야할듯
  // 안그러니까 방향키누를때마다 아다리 잘못 맞으면 걍 무브다운이 안되고 이상한 짓 한다.
  // 아니면 가만히 냅두면 정상작동인데 블락제거될때 방향키 막 좌우로 누르면 버그가 발생함..원인은???

  function checkMovingBlock() {
    if (!interval && !turn) {
      clearInterval(setIntervalCheckMovingBlock);
      // blocktype을 여기서 바꿀게끔..
      // currentBlockShape = '';
      turn = true;
      lastSavedBlockNumberArray = currentBlockArray;
      // 가장 높은 높이의 blockLine을 찾기 추후 block 모두 내리기에 사용****************************************
      const lastSavedBlockLines = getBlockLinesOfLastSavedBlock(
        lastSavedBlockNumberArray
      );
      const smallestBlockLine = Math.min(...lastSavedBlockLines);
      if (smallestBlockLine < maxHeightBlockLine) {
        maxHeightBlockLine = smallestBlockLine;
      }
      // ****************************************************************************************************
      makeNewBlock();
      moveBlockDownPerSecond();
      // keyPressHandler();          ******* keyPressHandler가 한번 이상 설정되면 두번적용되서 두칸이 이동함 주의*******
      blockSave();
      removefullColorLine();
      moveAboveRemovedBlockToDown();
    }
  }
}

function removefullColorLine() {
  const blockLine = getBlockLine();
  let blockLineData = getDataOfBlockLineColor(blockLine);
  console.log(blockLineData);
  removeBlockLineFullOfColor(blockLineData);

  function getBlockLine() {
    let result = getBlockLinesOfLastSavedBlock(lastSavedBlockNumberArray);
    console.log(result);
    return removeDuplicationOfBlockLine(result);

    function removeDuplicationOfBlockLine(blockLineArray) {
      return [...new Set(blockLineArray)];
    }
  }

  function getDataOfBlockLineColor(blockLine) {
    const result = [];

    blockLine.map((bl) => {
      console.log(bl);
      const blockLineNumberArray = getBlockLineNumberArray(bl);
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

  function removeBlockLineFullOfColor(blockLineData) {
    blockLineData.map((block) => {
      console.log(block);
      if (block.full === "true") {
        removeBlockLine(block.blockLineNumberArray);
        removedBlockLine.push(block.blockLine);
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

function getBlockLineNumberArray(blockLine) {
  const result = [];
  for (let i = 1; i < 11; i++) {
    result.push(blockLine !== 0 ? blockLine * 10 + i : i);
    // 11-i에서 i로 변화줌
  }
  console.log(result);
  return result;
}

function getBlockLinesOfLastSavedBlock(lastSavedBlockNumberArray) {
  console.log(lastSavedBlockNumberArray);
  return lastSavedBlockNumberArray
    .map((b) => (b / 10 === 0 ? 0 : Math.floor(b / 10)))
    .filter((b) => b < 15);
}

function moveAboveRemovedBlockToDown() {
  const blockLineTodown = removedBlockLine.length;
  console.log(removedBlockLine);
  const boundryToDown = +removedBlockLine[0] - 1;
  console.log(boundryToDown);
  const boundryToTop = maxHeightBlockLine;
  console.log(boundryToTop);
  const minRemovedBlockLine = Math.min(...removedBlockLine);
  console.log(minRemovedBlockLine);
  const numberOfBlockLine = boundryToDown - boundryToTop + 1;
  if (removedBlockLine.length > 0 && minRemovedBlockLine > boundryToTop) {
    console.log(minRemovedBlockLine);
    console.log(removedBlockLine.length);
    // 위 조건문 보강해야!!!!!!!!!!!!!!!!!!!
    // 이후 removedBlockLine 비워둘 것

    // const totalNumberOfDownBlock = boundryToDown -boundryToTop;
    // for (let i = 0; i < blockLineTodown; i++) {
    console.log(numberOfBlockLine);
    for (let i = 0; i < numberOfBlockLine; i++) {
      const targetBlockLine = boundryToDown - i;
      const targetBlockLineNumberArray =
        getBlockLineNumberArray(targetBlockLine);
      console.log(targetBlockLineNumberArray);

      // block 색 기억해두기
      blockColorArray = [];
      targetBlockLineNumberArray.map((b) => {
        const blockColor = window
          .getComputedStyle(
            document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
          )
          .getPropertyValue("background-color");
        console.log(blockColor);
        blockColorArray.push(blockColor);
      });
      console.log(blockColorArray);

      currentKeyPress === "ArrowDown";
      currentBlockArray = targetBlockLineNumberArray;
      currentBlockShape = "blockLine";
      for (let i = 0; i < removedBlockLine.length; i++) {
        moveBlock();
        currentBlockArray = currentBlockArray.map((b) => +b + 10);
        console.log("한줄이동성공");
        // 한칸 이동한 만큼 current block array도 한칸 내려서 다음 for문도 정상적으로 수행하게 한다.
      }
      // moveBlock();

      // makeNewBlock과 canMove를 손봐서 remove된 곳을 fill할 수 있게, 이동할 수 있게 만들기!!!
    }

    removedBlockLine = [];
    currentBlockShape = "squre";
    // currentKeyPress === "ArrowDown";
  }
  return;
}
