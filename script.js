"use strict";

// script.js 에서 map과 game으로 Class 추출하던지 해서 더 객체지향프로그래밍을 완성시켜보자.
// 객체지향 완성 후, 추가 기능 넣고 design하던지 하자!

import {
  GAME_MAP_HEIGHT,
  MAX_HEIGHT_OF_GAME_MAP,
  CENTER_POSITION_NUMBER,
  DEFAULT_SCORE,
  SCORE_PER_ONE_LINE_BLOCK,
  NEXT_BLOCK_CENTER_POSITION_NUMBER,
} from "./config.js";
import GlobalData from "./GlobalData.js";
import BlockMakeData from "./BlockMakeData.js";
import BlockMoveData from "/BlockMoveData.js";
import LastSavedBlockData from "./LastSavedBlockData.js";
import EnrichedBlockLineData from "./EnrichedBlockLineData.js";
import BlockLineData from "./BlockLineData.js";
import BlockLineDataForRemove from "./BlockLineDataForRemove.js";
import BlockNumberArray from "./BlockNumberArray.js";
import NextBlockTypeData from "./NextBlockTypeData.js";

const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItem = document.querySelector(".tetris__nextItem");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");
const modal = document.querySelector(".tetris__gameOverModal");

function playGame() {
  // menu.style.visibility = "hidden";
  makeGameMap();
  makeNextItem();
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

function makeNextItem() {
  for (let i = 0; i < 8; i++) {
    const gridItem = makeNextGridItem(i);
    nextItem.append(gridItem);
  }

  function makeNextGridItem(i) {
    const gridCell = document.createElement("div");
    gridCell.classList.add("tetris__nextGridItem");
    gridCell.setAttribute("data-id", i + 1);

    return gridCell;
  }
}

function gameStart() {
  const globalData = new GlobalData();

  makeBlock(globalData);
  makeNextBlock(globalData);
  moveBlockDownPerSecond(globalData);
  keyPressHandler(globalData);
  blockSave(globalData);
}

function makeBlock(globalData, blockNumberArray) {
  const DataAboutMakeBlock = new BlockMakeData(globalData, blockNumberArray);

  paintBlocks(globalData, DataAboutMakeBlock);

  function paintBlocks(globalData, data) {
    if (data.isBlockTypeBlockLine) {
      return paintBlockLine(globalData, data.currentBlockNumberArray);
    }

    if (!data.isThereEmptySpace) return gameOver(globalData);

    paintBlock(data);
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

  function paintBlock(data) {
    data.currentBlockNumberArray.map((item) => {
      const miniBlock = document.querySelector(
        `.tetris__gridItem[data-id="${item}"]`
      );
      miniBlock.style.backgroundColor = `${data.blockColor}`;
    });
  }
}

function moveBlock(globalData) {
  removeCurrentBlock(globalData);
  const newBlockNumberArrayData = new BlockNumberArray(globalData);
  makeBlock(globalData, newBlockNumberArrayData.blockNumberArray);
}

function removeCurrentBlock(globalData) {
  globalData.currentBlockArray.map((b) => {
    const miniBlock = document.querySelector(
      `.tetris__gridItem[data-id="${b}"]`
    );
    miniBlock.style.backgroundColor = "white";
  });
}

function canBlockMove(globalData) {
  const dataAboutMove = new BlockMoveData(globalData);

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

function makeNextBlock(globalData) {
  const nextBlockTypeNumberArray = new NextBlockTypeData(globalData)
    .nextBlockTypeNumberArray;
  paintNextBlockItem(nextBlockTypeNumberArray);

  function paintNextBlockItem(nextBlockTypeNumberArray) {
    nextBlockTypeNumberArray.map((item) => {
      const miniBlock = document.querySelector(
        `.tetris__nextGridItem[data-id="${item}"]`
      );
      miniBlock.style.backgroundColor = `white`;
    });
  }
}

function moveBlockDownPerSecond(globalData) {
  globalData.isBlockGoingDown = true;
  const intervalmillisecond = getMoveBlockDownSecond(globalData);
  // console.log(intervalmillisecond);

  const setIntervalMoveBlockDown = setInterval(
    moveBlockDown.bind(null, globalData),
    intervalmillisecond
  );

  function getMoveBlockDownSecond(globalData) {
    if (globalData.score > 5 && globalData.score < 10) {
      return 900;
    } else if (globalData.score > 10 && globalData.score < 20) {
      return 600;
    } else if (globalData.score > 20) {
      return 300;
    }

    return 1000;
  }

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
    if (!globalData.gameRunning) return;
    if (isArrowKeyPressed(globalData, e.key)) moveBlock(globalData);
    if (isSpaceKeyPressed(globalData, e.key)) moveBlock(globalData);

    function isArrowKeyPressed(globalData, key) {
      globalData.currentKeyPress = key;

      return (
        globalData.currentKeyPress === "ArrowRight" ||
        globalData.currentKeyPress === "ArrowLeft" ||
        globalData.currentKeyPress === "ArrowUp" ||
        globalData.currentKeyPress === "ArrowDown"
      );
    }

    function isSpaceKeyPressed(globalData, key) {
      globalData.currentKeyPress = key;

      return globalData.currentKeyPress === " ";
    }
  });
}

// 마지막으로 블락이 바닥에 놓이고 다음 블록이 나올 때 까지의 시간을 일정하게 해보자, 지금은 조금 덜일정함

function blockSave(globalData) {
  const setIntervalCheckBlockIsStop = setInterval(
    checkBlockIsStop.bind(null, globalData),
    50
  );

  function checkBlockIsStop(globalData) {
    if (globalData.isBlockGoingDown) return;
    // if (!globalData.isBlockGoingDown) {
    clearInterval(setIntervalCheckBlockIsStop);

    const blockSaveData = new LastSavedBlockData(globalData);

    removefullColorLine(globalData, blockSaveData);
    moveAllBlockLineToBottom(globalData, blockSaveData);
    renderScore(globalData);
    startNextBlock(globalData, blockSaveData);
    // // keyPressHandler();          ******* keyPressHandler가 한번 이상 설정되면 두번적용되서 두칸이 이동함 주의*******
    // }

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
      const inGameData = new BlockLineData(globalData, data);

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
      resetGameData(globalData, data);

      makeBlock(globalData);
      makeNextBlock(globalData);
      if (globalData.gameRunning) {
        moveBlockDownPerSecond(globalData);
        blockSave(globalData);
      }

      function resetGameData(globalData, data) {
        globalData.currentBlockType = "";

        globalData.maxHeightBlockLine = data.removedBlockLine.length
          ? globalData.maxHeightBlockLine + data.removedBlockLine.length
          : globalData.maxHeightBlockLine;
        // : data.maxHeightBlockLine;

        globalData.removedBlockLine = 0;
        globalData.justMaked = true;

        clearNextGridItem();

        function clearNextGridItem() {
          const AllNextGridItem = document.querySelectorAll(
            ".tetris__nextGridItem"
          );

          AllNextGridItem.forEach((curruntValue) => {
            curruntValue.style.backgroundColor = "black";
          });
        }
      }
    }
  }
}
