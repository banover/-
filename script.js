"use strict";

import EnrichedBlockLineData from "./EnrichedBlockLineData.js";
import BlockLineData from "./BlockLineData.js";
import BlockLineDataForRemove from "./BlockLineDataForRemove.js";

const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItemBox = document.querySelector(".tetris__nextItemBox");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");
const modal = document.querySelector(".tetris__gameOverModal");

const GAME_MAP_HEIGHT = 15;
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
let blockColorArray;
// let shouldBeRemoved;
// let turn = true;
let isBlockGoingDown;
let score = DEFAULT_SCORE;
let gameRunning = true;

function playGame(e) {
  menu.style.visibility = "hidden";
  makeGameMap();
  gameStart();
}

// 게임 시작 버튼을 누르면 게임 시작
playingBtn.addEventListener("click", playGame);
// makeGameMap();
//   gameStart();

// **********************************************************************
// 여기서부터는 함수
// **********************************************************************

function makeGameMap() {
  for (let i = 0; i < GAME_MAP_HEIGHT * 10; i++) {
    const gridItem = makeGridItem(i);
    appendGridItemToGameMap(gridItem);
  }

  function makeGridItem(i) {
    const gridCell = document.createElement("div");
    gridCell.classList.add("tetris__gridItem");
    gridCell.setAttribute("data-id", i + 1);
    if (i < 10) {
      gridCell.style.visibility = "hidden";
    }
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
  const DataAboutMakeBlock = getDataAboutMakeBlock(blockNumberArray);
  paintBlocks(DataAboutMakeBlock);

  function getDataAboutMakeBlock(blockNumberArray) {
    const result = {};

    result.isFirstBlock =
      maxHeightBlockLine === MAX_HEIGHT_OF_GAME_MAP ? true : false;

    result.currentBlockType = currentBlockType
      ? currentBlockType
      : getRandomBlockType();

    result.currentBlockNumberArray = blockNumberArray
      ? setBlockNumberArray(blockNumberArray)
      : makeBlockNumberArray(result);

    console.log(result.currentBlockNumberArray);

    result.isBlockTypeBlockLine = result.currentBlockType === "blockLine";

    result.isThereEmptySpace = result.isFirstBlock
      ? true
      : isThereEmptySpace(result.currentBlockNumberArray);

    return result;
  }

  function getRandomBlockType() {
    const blockType = ["squre"];
    const randomNumber = Math.floor(Math.random() * blockType.length);
    const blockTypeNumber = randomNumber === 0 ? randomNumber : 0;
    currentBlockType = blockType[blockTypeNumber];
    return blockType[blockTypeNumber];
  }

  function setBlockNumberArray(blockNumberArray) {
    currentBlockArray = blockNumberArray;
    return blockNumberArray;
  }

  function makeBlockNumberArray(data) {
    if (data.currentBlockType === "squre") return makeSqureNumberArray(data);
    // blockType마다 함수 실행시키기
  }

  function makeSqureNumberArray(data) {
    const blockNumber = data.currentBlockNumberArray
      ? data.currentBlockNumberArray
      : [
          `${CENTER_POSITION_NUMBER}`,
          `${CENTER_POSITION_NUMBER + 1}`,
          `${CENTER_POSITION_NUMBER + 10}`,
          `${CENTER_POSITION_NUMBER + 11}`,
        ];

    currentBlockArray = blockNumber;

    return blockNumber;
  }

  function isThereEmptySpace(blockNumberArray) {
    console.log(blockNumberArray);
    return !blockNumberArray.some((b) => {
      const blockColor = window
        .getComputedStyle(
          document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
        )
        .getPropertyValue("background-color");

      return blockColor !== "rgb(255, 255, 255)";
    });
  }

  function paintBlocks(data) {
    if (data.isBlockTypeBlockLine) {
      return paintBlockLine(data.currentBlockNumberArray);
    }

    if (!data.isThereEmptySpace) return gameOver();
    paintBlock(data, "red");
  }

  function paintBlockLine(blockNumberArray) {
    blockNumberArray.map((item, index) => {
      const miniBlock = document.querySelector(
        `.tetris__gridItem[data-id="${item}"]`
      );
      miniBlock.style.backgroundColor = blockColorArray[index];
    });
    // blockColorArray = [];
  }
  // }

  function gameOver() {
    modal.style.display = "block";
    menu.style.visibility = "visible";
    gameRunning = false;
  }

  function paintBlock(data, color) {
    data.currentBlockNumberArray.map((item) => {
      const miniBlock = document.querySelector(
        `.tetris__gridItem[data-id="${item}"]`
      );
      miniBlock.style.backgroundColor = `${color}`;
    });
  }
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
  // blockline에서 canblockmove할필요가 잇나?
  if (currentBlockType === "blockLine" && canBlockMove()) {
    return currentBlockArray.map((b) => `${+b + 10}`);
  }

  if (currentBlockType === "squre" && canBlockMove()) {
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

function canBlockMove() {
  const dataAboutMove = getDataAboutMove();
  if (canFutureBlockExist(dataAboutMove)) return true;

  return false;

  function getDataAboutMove() {
    const result = {};
    result.futureBlockArray = makeFutureBlockArray();

    result.isBlockOverRightGameMap = isBlockOverRightGameMap(
      result.futureBlockArray
    );
    result.isBlockOverLeftGameMap = isBlockOverLeftGameMap(
      result.futureBlockArray
    );
    result.isBlockOverBottomGameMap = isBlockOverBottomGameMap(
      result.futureBlockArray
    );
    result.isFutureBlockOverGameMap = isFutureBlockOverGameMap(result);

    result.isAlreadyBlockThere = isAlreadyBlockThere;
    result.canfutureBlockPainted = canfutureBlockPainted;
    return result;
  }

  function makeFutureBlockArray() {
    console.log(currentBlockArray);
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

  function isBlockOverRightGameMap(futureBlockArray) {
    return (
      currentBlockArray.some((b) => b % 10 === 0) &&
      futureBlockArray.some((b) => b % 10 === 1)
    );
  }

  function isBlockOverLeftGameMap(futureBlockArray) {
    return (
      currentBlockArray.some((b) => b % 10 === 1) &&
      futureBlockArray.some((b) => b % 10 === 0)
    );
  }

  function isBlockOverBottomGameMap(futureBlockArray) {
    return futureBlockArray.some((b) => +b > GAME_MAP_HEIGHT * 10);
  }

  function isFutureBlockOverGameMap(data) {
    return data.isBlockOverRightGameMap ||
      data.isBlockOverLeftGameMap ||
      data.isBlockOverBottomGameMap
      ? true
      : false;
  }

  function isAlreadyBlockThere(futureBlock) {
    const futureBlockColor = window
      .getComputedStyle(
        document.querySelector(`.tetris__gridItem[data-id="${futureBlock}"]`)
      )
      .getPropertyValue("background-color");

    return futureBlockColor !== "rgb(255, 255, 255)";
  }

  function canfutureBlockPainted(data) {
    return !data.futureBlockArray.some((b) => data.isAlreadyBlockThere(b));
  }

  function canFutureBlockExist(data) {
    if (currentBlockType !== "blockLine" && data.isFutureBlockOverGameMap) {
      console.log("canFutureBlockExitst 통과");
      return false;
    }

    return data.canfutureBlockPainted(data);
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
      startNextBlock(blockSaveData);
      // // keyPressHandler();          ******* keyPressHandler가 한번 이상 설정되면 두번적용되서 두칸이 이동함 주의*******
    }

    function setDataAboutLastSavedBlock() {
      const result = {};

      result.lastSavedBlockNumberArray = getLastSavedBlockNumberArray();
      result.lastSavedBlockLines = getBlockLinesOfLastSavedBlock();
      result.smallestBlockLine = Math.min(...result.lastSavedBlockLines);
      result.maxHeightBlockLine = getMaxHeightBlockLine();
      result.removedBlockLine = [];

      return result;

      function getLastSavedBlockNumberArray() {
        lastSavedBlockNumberArray = currentBlockArray;
        return lastSavedBlockNumberArray;
      }

      function getBlockLinesOfLastSavedBlock() {
        const blockLineArray = result.lastSavedBlockNumberArray
          .map((b) => (b / 10 === 0 ? 0 : Math.floor(b / 10)))
          .filter((b) => b < GAME_MAP_HEIGHT);

        return [...new Set(blockLineArray)];
        // 개선하자면 굳이 lastSavedBlockNumberArray를 다 map하기보다는 부분만 사용하겠금...
      }

      function getMaxHeightBlockLine() {
        if (result.smallestBlockLine < maxHeightBlockLine) {
          maxHeightBlockLine = result.smallestBlockLine;
        }
        return maxHeightBlockLine;
      }
    }

    function removefullColorLine(data) {
      const blockLineData = getBlockLineData(data);
      // const blockLineData = ;
      removeBlockLineFullOfColor(blockLineData);
      saveRemovedBlockLine(blockLineData, data);

      function getBlockLineData() {
        const result = [];
        for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
          //
          //
          result.push(getDataOfBlockLineColor(data.lastSavedBlockLines[i]));
          // result.push(new BlockLineDataForRemove(data.lastSavedBlockLines[i]));
        }
        return result;
      }

      function getDataOfBlockLineColor(blockLine) {
        const result = {};

        result.blockLine = blockLine;
        result.blockLineNumberArray = getBlockLineNumberArray(result.blockLine);
        result.isWhiteBlock = isWhiteBlock;
        result.isfull = CheckFullColorLine();

        return result;

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

        function CheckFullColorLine() {
          return !result.blockLineNumberArray.some((blockNumber) =>
            result.isWhiteBlock(blockNumber)
          );
        }
      }

      function removeBlockLineFullOfColor(blockLineData) {
        console.log(blockLineData);
        for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
          console.log(blockLineData[i].isfull);
          if (blockLineData[i].isfull) {
            removeBlockLine(blockLineData[i].blockLineNumberArray);
            // removeBlcokLine하고 나서 다시 blockLindData의 정보를 살피면 getter인 isfull이 다시 계산되어서 false로 전환된다.
            // 따라서 그냥 class안에 별도의 removedblockline을 만들어서 쓰자..

            console.log(blockLineData[i]);
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

      function saveRemovedBlockLine(blockLineData, data) {
        for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
          if (blockLineData[i].isfull) {
            data.removedBlockLine.push(blockLineData[i].blockLine);
          }
        }
        console.log(data.removedBlockLine);
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
      const inGameData = new BlockLineData(data);
      moveRemainBlockDown(inGameData);

      function moveRemainBlockDown(inGameData) {
        const enrichedData = new EnrichedBlockLineData(inGameData);
        moveTargetBlockLineToDown(enrichedData);

        function moveTargetBlockLineToDown(enrichedData) {
          if (enrichedData?.targetBlockLineNumberArray?.length) {
            for (let i = 0; i < enrichedData.numberOfBlockLine; i++) {
              currentBlockArray = enrichedData.targetBlockLineNumberArray[i];
              currentBlockType = "blockLine";
              blockColorArray = enrichedData.getBlockLineColors(
                enrichedData.targetBlockLineNumberArray[i]
              );
              for (let j = 0; j < enrichedData.removedBlockLine.length; j++) {
                currentKeyPress = "ArrowDown";
                moveBlock();
                // currentBlockArray = currentBlockArray.map((b) => +b + 10);
              }
            }
          }
          // currentBlockType = "";
        }
      }
    }

    function renderScore() {
      const scoreElement = document.querySelector(".tetris__scoreBox");
      if (removedBlockLine.length) {
        for (let i = 0; i < removedBlockLine.length; i++) {
          addScore();
        }
      }
      scoreElement.textContent = `점수: ${score}`;

      function addScore() {
        score += SCORE_PER_ONE_LINE_BLOCK;
      }
    }

    function startNextBlock(data) {
      if (data.removedBlockLine.length) {
        resetGameData(data);
      }

      makeBlock();
      if (gameRunning) {
        moveBlockDownPerSecond();
        blockSave();
      }

      function resetGameData(data) {
        currentBlockType = "";
        data.maxHeightBlockLine += data.removedBlockLine.length;
        data.removedBlockLine.length = 0;
      }
    }
  }
}
