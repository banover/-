"use strict";

import {
  GAME_MAP_HEIGHT,
  MAX_HEIGHT_OF_GAME_MAP,
  CENTER_POSITION_NUMBER,
  DEFAULT_SCORE,
  SCORE_PER_ONE_LINE_BLOCK,
} from "./config.js";
import GlobalData from "./GlobalData.js";
import BlockMakeData from "./BlockMakeData.js";
import BlockMoveData from "/BlockMoveData.js";
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
  const DataAboutMakeBlock = new BlockMakeData(
    globalData,
    blockNumberArray,
    MAX_HEIGHT_OF_GAME_MAP,
    CENTER_POSITION_NUMBER
  );

  paintBlocks(globalData, DataAboutMakeBlock);

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
  const dataAboutMove = new BlockMoveData(globalData, GAME_MAP_HEIGHT);

  if (canFutureBlockExist(globalData, dataAboutMove)) return true;

  return false;

  function canFutureBlockExist(globalData, data) {
    if (
      globalData.currentBlockType !== "blockLine" &&
      data.isFutureBlockOverGameMap
    ) {
      return false;
    }

    return data.canfutureBlockPainted();
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
