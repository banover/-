const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItemBox = document.querySelector(".tetris__nextItemBox");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");
const modal = document.querySelector(".tetris__gameOverModal");

const CENTER_POSITION_NUMBER = 5;
const MAX_HEIGHT_OF_GAME_MAP = 14;
const DEFAULT_SCORE = 0;
const SCORE_PER_ONE_LINE_BLOCK = 5;

// 배열로 만들어 놨다가 추후에 random으로 currentBlockShape으로 값 넘겨주기
const blockShape = ["squre"];

let currentBlockArray;

let currentBlockType;
let currentKeyPress;
let lastSavedBlockNumberArray;
let lastSavedBlockLine;
let maxHeightBlockLine = MAX_HEIGHT_OF_GAME_MAP;
let removedBlockLine = [];
let blockColorArray = [];
// let shouldBeRemoved;
let turn = true;
let isBlockGoingDown;
let score = DEFAULT_SCORE;
let gameRunning = true;

function playGame(e) {
  // console.log(e);
  menu.style.display = "none";
  makeGameMap();
}

// 게임 시작 버튼을 누르면 게임 시작
// playingBtn.addEventListener("click", playGame);
makeGameMap();
gameStart();

// **********************************************************************
// 여기서부터는 함수
// **********************************************************************

function makeGameMap() {
  for (let i = 0; i < 150; i++) {
    const gridItem = makeGridItem(i);
    appendGridItemToGameMap(gridItem);
  }

  function makeGridItem(i) {
    const gridCell = document.createElement("div");
    gridCell.classList.add("tetris__gridItem");
    gridCell.setAttribute("data-id", i + 1);
    // if (i < 10) {
    //   gridCell.style.visibility = "hidden";
    // }
    return gridCell;
  }

  function appendGridItemToGameMap(gridItem) {
    playingBox.append(gridItem);
  }
}

function gameStart() {
  makeBlock();
  moveBlockDownPerSecond();
  keyPressHandler();
  blockSave();
}

function makeBlock(blockNumberArray) {
  if (isBlockTypeBlockLine()) return makeBlockLine(blockNumberArray);
  selectTypeOfBlock(blockNumberArray);
  makeBlockTypeShape(blockNumberArray);
  if (!canBlockExist()) return gameOver();
  paintBlock("red");

  function isBlockTypeBlockLine() {
    return currentBlockType === "blockLine";
  }

  function makeBlockLine(blockNumberArray) {
    paintBlockLine("red");

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

  function selectTypeOfBlock(blockNumberArray) {
    currentBlockType = blockNumberArray
      ? currentBlockType
      : getRandomBlockType();
  }

  function getRandomBlockType() {
    const blockType = ["squre"];
    const randomNumber = Math.floor(Math.random() * blockType.length);
    const blockTypeNumber = randomNumber === 0 ? randomNumber : 0;
    return blockType[blockTypeNumber];
  }
}

function makeBlockTypeShape(blockNumberArray) {
  if (currentBlockType === "squre") return makeSqureShape(blockNumberArray);
  // blockType마다 함수 실행시키기
}

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
  currentBlockType = "squre";
  currentBlockArray = blockNumber;
}

function canBlockExist() {
  return isThereEmptySpace();
}

function isThereEmptySpace() {
  return !currentBlockArray.some((b) => {
    const blockColor = window
      .getComputedStyle(
        document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
      )
      .getPropertyValue("background-color");

    return blockColor !== "rgb(255, 255, 255)";
  });
}

function gameOver() {
  modal.style.display = "block";
  gameRunning = false;
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
  makeBlock(makeNewBlockNumberArray());
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
  if (currentBlockType === "blockLine" && canBlockMove()) {
    return currentBlockArray.map((b) => `${+b + 10}`);
  }

  if (currentBlockType === "squre" && canBlockMove()) {
    if (currentKeyPress === "ArrowRight")
      return currentBlockArray.map((b) => `${+b + 1}`);
    if (currentKeyPress === "ArrowLeft")
      return currentBlockArray.map((b) => `${+b - 1}`);

    if (currentKeyPress === "ArrowUp") return currentBlockArray;
    // arrowUP에 버그 있음 확인
    if (currentKeyPress === "ArrowDown")
      return currentBlockArray.map((b) => `${+b + 10}`);
  }

  return currentBlockArray;
}

function canBlockMove() {
  if (canFutureBlockExist()) return true;
  // if (currentBlockType === "squre" && canFutureBlockMove()) return true;
  // if (currentBlockType === "blockLine" && canFutureBlockMove()) return true;
  return false;

  function canFutureBlockExist() {
    const futureBlockArray = makeFutureBlockArray();

    if (
      currentBlockType !== "blockLine" &&
      isFutureBlockOverGameMap(futureBlockArray)
    ) {
      return false;
    }
    return canfutureBlockPainted(futureBlockArray);

    function canfutureBlockPainted(futureBlockArray) {
      return !futureBlockArray.some((b) => isAlreadyBlockThere(b));
    }

    function isAlreadyBlockThere(futureBlock) {
      const futureBlockColor = window
        .getComputedStyle(
          document.querySelector(`.tetris__gridItem[data-id="${futureBlock}"]`)
        )
        .getPropertyValue("background-color");

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
    return currentBlockArray
      .map((b) => +b + 10)
      .filter((b) => !currentBlockArray.includes(`${b}`));
  }

  if (currentKeyPress === "ArrowUp") return currentBlockArray;
}

function isFutureBlockOverGameMap(futureBlockArray) {
  return isBlockOverRightGameMap() ||
    isBlockOverLeftGameMap() ||
    isBlockOverBottomGameMap()
    ? true
    : false;

  function isBlockOverRightGameMap() {
    return (
      currentBlockArray.some((b) => b % 10 === 0) &&
      futureBlockArray.some((b) => b % 10 === 1)
    );
  }

  function isBlockOverLeftGameMap() {
    return (
      currentBlockArray.some((b) => b % 10 === 1) &&
      futureBlockArray.some((b) => b % 10 === 0)
    );
  }

  function isBlockOverBottomGameMap() {
    return futureBlockArray.some((b) => +b > 150);
  }
}

function moveBlockDownPerSecond() {
  isBlockGoingDown = true;
  const setIntervalMoveBlockDown = setInterval(moveBlockDown, 1000);

  function moveBlockDown() {
    currentKeyPress = "ArrowDown";
    canBlockMove() ? moveBlock() : clearIntervalMoveBlockDown();
  }

  function clearIntervalMoveBlockDown() {
    clearInterval(setIntervalMoveBlockDown);
    isBlockGoingDown = false;
    // turn = false;
  }
}

function blockSave() {
  // const setIntervalCheckBlockIsStop = setInterval(checkBlockIsStop, 500); checkBlockIsStop.bind(null, data) 이런식으로 data 넣을 수 있음
  // data와 로직을 분리하자!
  const setIntervalCheckBlockIsStop = setInterval(checkBlockIsStop, 500);

  function checkBlockIsStop() {
    // if (!isBlockGoingDown && !turn) {
    if (!isBlockGoingDown) {
      clearInterval(setIntervalCheckBlockIsStop);
      // turn = true;
      const blockSaveData = setDataAboutLastSavedBlock();
      removefullColorLine(blockSaveData);
      moveAllBlockLineToBottom(blockSaveData);
      renderScore();
      startNextBlcok();
      // // keyPressHandler();          ******* keyPressHandler가 한번 이상 설정되면 두번적용되서 두칸이 이동함 주의*******
    }

    function setDataAboutLastSavedBlock() {
      result = {};

      result.lastSavedBlockNumberArray = getLastSavedBlockNumberArray();
      result.lastSavedBlockLines = getBlockLinesOfLastSavedBlock(
        result.lastSavedBlockNumberArray
      );
      result.smallestBlockLine = Math.min(...result.lastSavedBlockLines);
      result.maxHeightBlockLine = getMaxHeightBlockLine(
        result.smallestBlockLine
      );

      return result;

      // **************************************************************************************************

      // lastSavedBlockNumberArray = getLastSavedBlockNumberArray();
      // const lastSavedBlockLines = getBlockLinesOfLastSavedBlock(
      //   lastSavedBlockNumberArray
      // );

      // lastSavedBlockLine = lastSavedBlockLines;
      // const smallestBlockLine = Math.min(...lastSavedBlockLines);
      // maxHeightBlockLine = getMaxHeightBlockLine(smallestBlockLine);
      // // if (smallestBlockLine < maxHeightBlockLine) {
      // //   maxHeightBlockLine = smallestBlockLine;
      // // }

      function getLastSavedBlockNumberArray() {
        lastSavedBlockNumberArray = currentBlockArray;
        return lastSavedBlockNumberArray;
      }

      function getBlockLinesOfLastSavedBlock(lastSavedBlockNumberArray) {
        const blockLineArray = lastSavedBlockNumberArray
          .map((b) => (b / 10 === 0 ? 0 : Math.floor(b / 10)))
          .filter((b) => b < 15);

        return [...new Set(blockLineArray)];
      }

      function getMaxHeightBlockLine(smallestBlockLine) {
        if (smallestBlockLine < maxHeightBlockLine) {
          maxHeightBlockLine = smallestBlockLine;
        }
        return maxHeightBlockLine;
      }
    }

    function removefullColorLine(data) {
      for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
        let blockLineData = getDataOfBlockLineColor(
          data.lastSavedBlockLines[i]
        );
        blockLineData.removeBlockLineFullOfColor;
      }

      function getDataOfBlockLineColor(blockLine) {
        const result = {};

        result.blockLine = blockLine;
        result.blockLineNumberArray = getBlockLineNumberArray(result.blockLine);
        result.isWhiteBlock = isWhiteBlock;
        result.isfull = CheckFullColorLine(result);
        result.removeBlockLine = removeBlockLine;
        result.addScore = addScore;
        result.removeBlockLineFullOfColor = removeBlockLineFullOfColor(result);

        // const result = [];
        // blockLine.map((bl) => {

        //   const blockLineNumberArray = getBlockLineNumberArray(bl);
        //   const isfull = CheckFullColorLine(blockLineNumberArray);
        //   if (isfull) {
        //     shouldBeRemoved = true;
        //   }
        //   result.push({
        //     blockLine: `${bl}`,
        //     full: `${isfull}`,
        //     blockLineNumberArray,
        //   });
        // });
        return result;
      }

      function CheckFullColorLine(blockLineData) {
        return !blockLineData.blockLineNumberArray.some((blockNumber) =>
          blockLineData.isWhiteBlock(blockNumber)
        );
      }

      function isWhiteBlock(blockNumber) {
        const BlockColor = window
          .getComputedStyle(
            document.querySelector(
              `.tetris__gridItem[data-id="${blockNumber}"]`
            )
          )
          .getPropertyValue("background-color");

        return BlockColor === "rgb(255, 255, 255)";
      }

      function removeBlockLineFullOfColor(blockLineData) {
        if (blockLineData.isfull) {
          blockLineData.removeBlockLine(blockLineData.blockLineNumberArray);
          removedBlockLine.push(blockLineData.blockLine);
          blockLineData.addScore();
        }
        // });
        // }
        // if (shouldBeRemoved) {
        //   shouldBeRemoved = false;
        //   blockLineData.map((block) => {
        //     if (block.full === "true") {
        //       removeBlockLine(block.blockLineNumberArray);
        //       removedBlockLine.push(block.blockLine);
        //       addScore();
        //     }
        //   });
        // }
      }

      function removeBlockLine(numberArray) {
        numberArray.map((b) => {
          document.querySelector(
            `.tetris__gridItem[data-id="${b}"]`
          ).style.backgroundColor = "white";
        });
      }

      function addScore() {
        score += SCORE_PER_ONE_LINE_BLOCK;
      }
    }

    function getBlockLineNumberArray(blockLine) {
      const result = [];
      for (let i = 1; i < 11; i++) {
        result.push(blockLine !== 0 ? blockLine * 10 + i : i);
      }

      return result;
    }

    function moveAllBlockLineToBottom(data) {
      const inGameData = makeDataAboutMoveBlockLine();
      // const enrichedData = makeEnrichedData(initialData);

      if (inGameData.isBlockLineRemoved && inGameData.isRemainBlockGoDown) {
        inGameData.moveRemainBlockDown;
        inGameData.resetGameData;
      }

      function makeDataAboutMoveBlockLine() {
        const result = {};
        result.removedBlockLine = removedBlockLine;
        result.numberOfBlockLineTodown = result.removedBlockLine.length;
        result.boundryToDown = +removedBlockLine[0] - 1;
        result.boundryToTop = data.maxHeightBlockLine;
        result.minRemovedBlockLine = Math.min(...removedBlockLine);
        result.numberOfBlockLine =
          result.boundryToDown - result.boundryToTop + 1;

        result.isRemainBlockGoDown = isRemainBlockGoDown(result);
        result.isBlockLineRemoved = isBlockLineRemoved(result);
        result.getBlockLineColors = getBlockLineColors;
        result.getBlockLineNumberArray = getBlockLineNumberArray;
        result.moveTargetBlockLineToDown = moveTargetBlockLineToDown;

        result.moveRemainBlockDown = moveRemainBlockDown(result);
        result.resetGameData = resetGameData(data.maxHeightBlockLine);

        return result;
      }

      function isRemainBlockGoDown(data) {
        return data.minRemovedBlockLine > data.boundryToTop;
      }

      function isBlockLineRemoved(data) {
        return data.numberOfBlockLineTodown > 0;
      }

      function getBlockLineColors(targetBlockLineNumberArray) {
        blockColorArray = [];

        targetBlockLineNumberArray.map((b) => {
          const blockColor = window
            .getComputedStyle(
              document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
            )
            .getPropertyValue("background-color");

          blockColorArray.push(blockColor);
        });
      }

      function moveTargetBlockLineToDown(data, targetBlockLineNumberArray) {
        currentBlockArray = targetBlockLineNumberArray;
        currentBlockType = "blockLine";
        for (let i = 0; i < data.removedBlockLine.length; i++) {
          currentKeyPress = "ArrowDown";
          moveBlock();
          currentBlockArray = currentBlockArray.map((b) => +b + 10);
        }
      }

      function moveRemainBlockDown(data) {
        for (let i = 0; i < data.numberOfBlockLine; i++) {
          const targetBlockLine = data.boundryToDown - i;
          const targetBlockLineNumberArray =
            data.getBlockLineNumberArray(targetBlockLine);

          data.getBlockLineColors(targetBlockLineNumberArray);
          data.moveTargetBlockLineToDown(data, targetBlockLineNumberArray);

          // for (let i = 0; i < data.numberOfBlockLine; i++) {
          //   const targetBlockLine = data.boundryToDown - i;
          //   const targetBlockLineNumberArray =
          //     getBlockLineNumberArray(targetBlockLine);

          //   getBlockLineColors();
          //   moveTargetBlockLineToDown();

          // function getBlockLineColors() {
          //   blockColorArray = [];
          //   targetBlockLineNumberArray.map((b) => {
          //     const blockColor = window
          //       .getComputedStyle(
          //         document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
          //       )
          //       .getPropertyValue("background-color");

          //     blockColorArray.push(blockColor);
          //   });
          // }

          // function moveTargetBlockLineToDown(data, targetBlockLineNumberArray) {
          //   currentBlockArray = targetBlockLineNumberArray;
          //   currentBlockType = "blockLine";
          //   for (let i = 0; i < data.removedBlockLine.length; i++) {
          //     currentKeyPress = "ArrowDown";
          //     moveBlock();
          //     currentBlockArray = currentBlockArray.map((b) => +b + 10);
          //   }
          // }
        }
      }

      function resetGameData(maxHeightBlockLine) {
        currentBlockType = "squre";
        maxHeightBlockLine += removedBlockLine.length;
        removedBlockLine.length = 0;
      }
    }

    function renderScore() {
      const scoreElement = document.querySelector(".tetris__scoreBox");
      scoreElement.textContent = `점수: ${score}`;
    }

    function startNextBlcok() {
      makeBlock();
      if (gameRunning) {
        moveBlockDownPerSecond();
        blockSave();
      }
    }
  }
}
