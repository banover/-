"use strict";

import GlobalData from "./GlobalData.js";
import LastSavedBlockData from "./LastSavedBlockData.js";
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

function playGame() {
  // menu.style.visibility = "hidden";
  makeGameMap();
  gameStart();
}

playingBtn.addEventListener("click", playGame);

// **********************************************************************
// 여기서부터는 함수
// **********************************************************************

function makeGameMap() {
  for (let i = 0; i < GAME_MAP_HEIGHT * 10; i++) {
    const gridItem = makeGridItem(i);
    playingBox.append(gridItem);
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
}

function gameStart() {
  const globalData = new GlobalData(MAX_HEIGHT_OF_GAME_MAP, DEFAULT_SCORE);

  makeBlock(globalData);
  moveBlockDownPerSecond(globalData);
  keyPressHandler(globalData);
  blockSave(globalData);
}

function makeBlock(globalData, blockNumberArray) {
  const DataAboutMakeBlock = getDataAboutMakeBlock(
    globalData,
    blockNumberArray
  );

  paintBlocks(globalData, DataAboutMakeBlock);

  function getDataAboutMakeBlock(globalData, blockNumberArray) {
    console.log(blockNumberArray);
    const result = {};

    result.isFirstBlock =
      globalData.maxHeightBlockLine === MAX_HEIGHT_OF_GAME_MAP ? true : false;

    result.currentBlockType = globalData.currentBlockType
      ? globalData.currentBlockType
      : getRandomBlockType(globalData);

    result.currentBlockNumberArray = blockNumberArray
      ? setBlockNumberArray(globalData, blockNumberArray)
      : makeBlockNumberArray(globalData, result);

    result.isBlockTypeBlockLine = result.currentBlockType === "blockLine";

    result.isThereEmptySpace = result.isFirstBlock
      ? true
      : isThereEmptySpace(result.currentBlockNumberArray);

    return result;
  }

  function getRandomBlockType(globalData) {
    const blockType = ["squre"];
    const randomNumber = Math.floor(Math.random() * blockType.length);
    const blockTypeNumber = randomNumber === 0 ? randomNumber : 0;
    globalData.currentBlockType = blockType[blockTypeNumber];

    return blockType[blockTypeNumber];
  }

  function setBlockNumberArray(globalData, blockNumberArray) {
    console.log(blockNumberArray);
    globalData.currentBlockArray = blockNumberArray;

    return blockNumberArray;
  }

  function makeBlockNumberArray(globalData, data) {
    if (data.currentBlockType === "squre")
      return makeSqureNumberArray(globalData, data);
    // blockType마다 함수 실행시키기
  }

  function makeSqureNumberArray(globalData, data) {
    const blockNumber = data.currentBlockNumberArray
      ? data.currentBlockNumberArray
      : [
          `${CENTER_POSITION_NUMBER}`,
          `${CENTER_POSITION_NUMBER + 1}`,
          `${CENTER_POSITION_NUMBER + 10}`,
          `${CENTER_POSITION_NUMBER + 11}`,
        ];

    globalData.currentBlockArray = blockNumber;

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

  function paintBlocks(globalData, data) {
    if (data.isBlockTypeBlockLine) {
      return paintBlockLine(globalData, data.currentBlockNumberArray);
    }

    if (!data.isThereEmptySpace) return gameOver(globalData);
    paintBlock(data, "red");
  }

  function paintBlockLine(globalData, blockNumberArray) {
    blockNumberArray.map((item, index) => {
      const miniBlock = document.querySelector(
        `.tetris__gridItem[data-id="${item}"]`
      );
      miniBlock.style.backgroundColor = globalData.blockColorArray[index];
    });
  }

  function gameOver(globalData) {
    modal.style.display = "block";
    menu.style.visibility = "visible";
    globalData.gameRunning = false;
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

function moveBlock(globalData) {
  removeCurrentBlock(globalData);
  makeBlock(globalData, makeNewBlockNumberArray(globalData));
}

function removeCurrentBlock(globalData) {
  globalData.currentBlockArray.map((b) => {
    const miniBlock = document.querySelector(
      `.tetris__gridItem[data-id="${b}"]`
    );
    miniBlock.style.backgroundColor = "white";
  });
}

function makeNewBlockNumberArray(globalData) {
  // if (globalData.currentBlockType === "blockLine" && canBlockMove(globalData)) {
  if (globalData.currentBlockType === "blockLine") {
    return globalData.currentBlockArray.map((b) => `${+b + 10}`);
  }

  if (globalData.currentBlockType === "squre" && canBlockMove(globalData)) {
    if (globalData.currentKeyPress === "ArrowRight") {
      const BlockArray = globalData.currentBlockArray.map((b) => `${+b + 1}`);
      globalData.currentBlockArray = BlockArray;

      return globalData.currentBlockArray;
    }
    if (globalData.currentKeyPress === "ArrowLeft") {
      const BlockArray = globalData.currentBlockArray.map((b) => `${+b - 1}`);
      globalData.currentBlockArray = BlockArray;

      return globalData.currentBlockArray;
    }

    if (globalData.currentKeyPress === "ArrowUp") {
      return globalData.currentBlockArray;
    }

    if (globalData.currentKeyPress === "ArrowDown") {
      const BlockArray = globalData.currentBlockArray.map((b) => `${+b + 10}`);
      globalData.currentBlockArray = BlockArray;

      return globalData.currentBlockArray;
    }
  }

  return globalData.currentBlockArray;
}

function canBlockMove(globalData) {
  const dataAboutMove = getDataAboutMove(globalData);
  if (canFutureBlockExist(globalData, dataAboutMove)) return true;

  return false;

  function getDataAboutMove(globalData) {
    const result = {};
    result.futureBlockArray = makeFutureBlockArray(globalData);

    result.isBlockOverRightGameMap = isBlockOverRightGameMap(
      globalData,
      result.futureBlockArray
    );
    result.isBlockOverLeftGameMap = isBlockOverLeftGameMap(
      globalData,
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

  function makeFutureBlockArray(globalData) {
    console.log(globalData.currentBlockArray);
    if (globalData.currentKeyPress === "ArrowLeft") {
      // if (currentKeyPress === "ArrowLeft") {
      return globalData.currentBlockArray
        .map((b) => +b - 1)
        .filter((b) => !globalData.currentBlockArray.includes(`${b}`));
    }

    if (globalData.currentKeyPress === "ArrowRight") {
      return globalData.currentBlockArray
        .map((b) => +b + 1)
        .filter((b) => !globalData.currentBlockArray.includes(`${b}`));
    }

    if (globalData.currentKeyPress === "ArrowDown") {
      return globalData.currentBlockArray
        .map((b) => +b + 10)
        .filter((b) => !globalData.currentBlockArray.includes(`${b}`));
    }

    if (globalData.currentKeyPress === "ArrowUp")
      return globalData.currentBlockArray;
  }

  function isBlockOverRightGameMap(globalData, futureBlockArray) {
    return (
      globalData.currentBlockArray.some((b) => b % 10 === 0) &&
      futureBlockArray.some((b) => b % 10 === 1)
    );
  }

  function isBlockOverLeftGameMap(globalData, futureBlockArray) {
    return (
      globalData.currentBlockArray.some((b) => b % 10 === 1) &&
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

  function canFutureBlockExist(globalData, data) {
    if (
      globalData.currentBlockType !== "blockLine" &&
      data.isFutureBlockOverGameMap
    ) {
      return false;
    }

    return data.canfutureBlockPainted(data);
  }
}

function moveBlockDownPerSecond(globalData) {
  globalData.isBlockGoingDown = true;

  const setIntervalMoveBlockDown = setInterval(
    moveBlockDown.bind(null, globalData),
    1000
  );

  function moveBlockDown(globalData) {
    globalData.currentKeyPress = "ArrowDown";

    canBlockMove(globalData)
      ? moveBlock(globalData)
      : clearIntervalMoveBlockDown(globalData);
  }

  function clearIntervalMoveBlockDown() {
    clearInterval(setIntervalMoveBlockDown);
    globalData.isBlockGoingDown = false;
  }
}

function keyPressHandler(globalData) {
  window.addEventListener("keydown", (e) => {
    if (isArrowKeyPressed(globalData, e.key)) moveBlock(globalData);

    function isArrowKeyPressed(globalData, key) {
      globalData.currentKeyPress = key;

      return (
        globalData.currentKeyPress === "ArrowRight" ||
        globalData.currentKeyPress === "ArrowLeft" ||
        globalData.currentKeyPress === "ArrowUp" ||
        globalData.currentKeyPress === "ArrowDown"
      );
    }
  });
}

function blockSave(globalData) {
  const setIntervalCheckBlockIsStop = setInterval(
    checkBlockIsStop.bind(null, globalData),
    500
  );

  function checkBlockIsStop(globalData) {
    if (!globalData.isBlockGoingDown) {
      clearInterval(setIntervalCheckBlockIsStop);

      const blockSaveData = new LastSavedBlockData(globalData, GAME_MAP_HEIGHT);
      removefullColorLine(globalData, blockSaveData);
      moveAllBlockLineToBottom(globalData, blockSaveData);
      renderScore(globalData);
      startNextBlock(globalData, blockSaveData);
      // // keyPressHandler();          ******* keyPressHandler가 한번 이상 설정되면 두번적용되서 두칸이 이동함 주의*******
    }

    function removefullColorLine(globalData, data) {
      const blockLineData = getBlockLineData(data);

      removeBlockLineFullOfColor(globalData, blockLineData);

      function getBlockLineData(data) {
        const result = [];
        for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
          result.push(new BlockLineDataForRemove(data.lastSavedBlockLines[i]));
        }
        return result;
      }

      function removeBlockLineFullOfColor(globalData, blockLineData) {
        for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
          if (blockLineData[i].isfull) {
            removeBlockLine(blockLineData[i].blockLineNumberArray);

            globalData.removedBlockLine = blockLineData[i].blockLine;
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
    }

    function moveAllBlockLineToBottom(globalData, data) {
      const inGameData = new BlockLineData(data);
      moveRemainBlockDown(globalData, inGameData);

      function moveRemainBlockDown(globalData, inGameData) {
        const enrichedData = new EnrichedBlockLineData(inGameData);
        moveTargetBlockLineToDown(globalData, enrichedData);

        function moveTargetBlockLineToDown(globalData, enrichedData) {
          if (enrichedData?.targetBlockLineNumberArray?.length) {
            for (let i = 0; i < enrichedData.numberOfBlockLine; i++) {
              globalData.currentBlockArray =
                enrichedData.targetBlockLineNumberArray[i];
              globalData.currentBlockType = "blockLine";
              globalData.blockColorArray = enrichedData.getBlockLineColors(
                enrichedData.targetBlockLineNumberArray[i]
              );
              for (let j = 0; j < enrichedData.removedBlockLine.length; j++) {
                globalData.currentKeyPress = "ArrowDown";
                moveBlock(globalData);
              }
            }
          }
        }
      }
    }

    function renderScore(globalData) {
      if (globalData.removedBlockLine.length) {
        for (let i = 0; i < globalData.removedBlockLine.length; i++) {
          addScore(globalData);
        }
      }

      scoreBox.textContent = `점수: ${globalData.score}`;

      function addScore(globalData) {
        globalData.score = globalData.score + SCORE_PER_ONE_LINE_BLOCK;
      }
    }

    function startNextBlock(globalData, data) {
      if (data.removedBlockLine.length) {
        resetGameData(globalData, data);
      }

      makeBlock(globalData);
      if (globalData.gameRunning) {
        moveBlockDownPerSecond(globalData);
        blockSave(globalData);
      }

      function resetGameData(globalData, data) {
        globalData.currentBlockType = "";
        data.maxHeightBlockLine =
          data.maxHeightBlockLine + data.removedBlockLine.length;

        data.removedBlockLine = 0;
      }
    }
  }
}
