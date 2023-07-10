const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItemBox = document.querySelector(".tetris__nextItemBox");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");
const modal = document.querySelector(".tetris__gameOverModal");

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
let shouldBeRemoved;
let turn = true;
let interval;
let score = 0;
// let gameOver = false;

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
    if (i < 10) {
      gridCell.style.visibility = "hidden";
    }
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
  // 여기서 만들려는 곳에 이미 block이 있으면 만들지 않고 gameover 변수 true로 바꾸는 등으로 게임의 끝을 알리자
  isGameContinue();

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

  function isGameContinue() {
    const isInitiallPlaceEmpty = !currentBlockArray.some((b) => {
      const blockColor = window
        .getComputedStyle(
          document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
        )
        .getPropertyValue("background-color");

      return blockColor !== "rgb(255, 255, 255)";
    });

    if (!isInitiallPlaceEmpty) {
      gameOver();
    }
  }

  function gameOver() {
    modal.style.display = "block";
  }
}

function makeBlockLine(blockNumberArray) {
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

  if (currentBlockShape === "squre" && canFutureBlockMove()) return true;
  if (currentBlockShape === "blockLine" && canFutureBlockMove()) return true;
  return false;

  function canFutureBlockMove() {
    console.log("canFutureBlockMove진입");
    const futureBlockArray = makeFutureBlockArray();
    return checkFutureBlockcanMove(futureBlockArray);

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
  const setIntervalCheckMovingBlock = setInterval(checkMovingBlock, 500);

  function checkMovingBlock() {
    let result;
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
      removefullColorLine();
      moveAllBlockLineToBottom();
      renderScore();
      startNextBlcok();
      // // keyPressHandler();          ******* keyPressHandler가 한번 이상 설정되면 두번적용되서 두칸이 이동함 주의*******
    }

    function startNextBlcok() {
      makeNewBlock();
      moveBlockDownPerSecond();
      blockSave();
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
      if (isfull) {
        shouldBeRemoved = true;
      }
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
    if (shouldBeRemoved) {
      blockLineData.map((block) => {
        console.log(block);
        if (block.full === "true") {
          removeBlockLine(block.blockLineNumberArray);
          removedBlockLine.push(block.blockLine);
          score += 5;
        }
      });
    }
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
// 여기서 버그**********************************************************

function moveAllBlockLineToBottom() {
  const numberOfBlockLineTodown = removedBlockLine.length;
  const boundryToDown = +removedBlockLine[0] - 1;
  console.log(boundryToDown);
  const boundryToTop = maxHeightBlockLine;
  console.log(boundryToTop);
  const minRemovedBlockLine = Math.min(...removedBlockLine);
  console.log(minRemovedBlockLine);
  const numberOfBlockLine = boundryToDown - boundryToTop + 1;

  if (numberOfBlockLineTodown > 0 && isThereDowningBlock) {
    moveRemainBlockDown();
    resetGameData();
  }

  function moveRemainBlockDown() {
    for (let i = 0; i < numberOfBlockLine; i++) {
      const targetBlockLine = boundryToDown - i;
      const targetBlockLineNumberArray =
        getBlockLineNumberArray(targetBlockLine);
      console.log(targetBlockLineNumberArray);

      getBlockLineColors();
      moveTargetBlockLineToDown();

      function getBlockLineColors() {
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
      }

      function moveTargetBlockLineToDown() {
        currentBlockArray = targetBlockLineNumberArray;
        currentBlockShape = "blockLine";
        for (let i = 0; i < removedBlockLine.length; i++) {
          currentKeyPress = "ArrowDown";
          moveBlock();
          currentBlockArray = currentBlockArray.map((b) => +b + 10);
          console.log("한줄이동성공");
        }
      }
    }
  }

  function resetGameData() {
    removedBlockLine = [];
    currentBlockShape = "squre";
    maxHeightBlockLine = getMaxHeightBlockLine();
  }

  function isThereDowningBlock() {
    return minRemovedBlockLine > boundryToTop;
  }
}

function getMaxHeightBlockLine() {
  // 기존의 maxHeightBlockLine에서
  // 한줄씩 내려가면서 색깔이 있는 블락을 다음 maxheightBlockline으로 설정
  let result;
  let BlockLineForCheck = maxHeightBlockLine + 1;
  for (let blockLine = BlockLineForCheck; blockLine < 15; blockLine++) {
    const BlockNumberArrayForCheck = getBlockLineNumberArray(blockLine);
    const isAllWhite = !BlockNumberArrayForCheck.some((b) => {
      const blockColor = window
        .getComputedStyle(
          document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
        )
        .getPropertyValue("background-color");
      console.log(blockColor);
      return blockColor !== "rgb(255, 255, 255)";
    });
    console.log(isAllWhite);
    if (isAllWhite === false) {
      result = blockLine;
      console.log(result);
      break;
    }
  }
  return result;
}

function renderScore() {
  const scoreElement = document.querySelector(".tetris__scoreBox");
  scoreElement.textContent = `점수: ${score}`;
}
