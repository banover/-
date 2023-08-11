"use strict";

// script.js 에서 map과 game으로 Class 추출하던지 해서 더 객체지향프로그래밍을 완성시켜보자.
// 객체지향 완성 후, 추가 기능 넣고 design하던지 하자!

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
  const globalData = new GlobalData();

  makeBlock(globalData);
  moveBlockDownPerSecond(globalData);
  keyPressHandler(globalData);
  blockSave(globalData);
}

function makeBlock(globalData, blockNumberArray) {
  const DataAboutMakeBlock = new BlockMakeData(globalData, blockNumberArray);
  console.log(DataAboutMakeBlock);
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

  if (canBlockMove(globalData)) {
    // if (globalData.currentBlockType === "squre" && canBlockMove(globalData)) {
    if (globalData.currentKeyPress === "ArrowRight") {
      const BlockArray = globalData.currentBlockArray.map((b) => `${+b + 1}`);
      globalData.currentBlockArray = BlockArray;

      return globalData.currentBlockArray;
    }
    if (globalData.currentKeyPress === "ArrowLeft") {
      console.log(canBlockMove(globalData));
      const BlockArray = globalData.currentBlockArray.map((b) => `${+b - 1}`);
      globalData.currentBlockArray = BlockArray;

      return globalData.currentBlockArray;
    }

    if (globalData.currentKeyPress === "ArrowUp") {
      if (globalData.currentBlockType === "squre") {
        return globalData.currentBlockArray;
      }
      console.log(globalData.currentBlockArray);
      if (globalData.currentBlockType === "bar") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b - 18}`;
          }
          if (i === 1) {
            return `${+b - 9}`;
          }
          if (i === 2) {
            return `${+b}`;
          }
          if (i === 3) {
            return `${+b + 9}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "bar-vertical";

        return globalData.currentBlockArray;
      }
      if (globalData.currentBlockType === "bar-vertical") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b + 18}`;
          }
          if (i === 1) {
            return `${+b + 9}`;
          }
          if (i === 2) {
            return `${+b}`;
          }
          if (i === 3) {
            return `${+b - 9}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "bar";
        return globalData.currentBlockArray;
      }

      if (globalData.currentBlockType === "z") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b - 8}`;
          }
          if (i === 1) {
            return `${+b}`;
          }
          if (i === 2) {
            return `${+b}`;
          }
          if (i === 3) {
            return `${+b - 10}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "z-vertical";

        return globalData.currentBlockArray;
      }
      if (globalData.currentBlockType === "z-vertical") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b + 8}`;
          }
          if (i === 1) {
            return `${+b}`;
          }
          if (i === 2) {
            return `${+b}`;
          }
          if (i === 3) {
            return `${+b + 10}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "z";
        return globalData.currentBlockArray;
      }

      if (globalData.currentBlockType === "z-reverse") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b - 10}`;
          }
          if (i === 1) {
            return `${+b}`;
          }
          if (i === 2) {
            return `${+b - 9}`;
          }
          if (i === 3) {
            return `${+b + 1}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "z-reverse-vertical";

        return globalData.currentBlockArray;
      }
      if (globalData.currentBlockType === "z-reverse-vertical") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b + 10}`;
          }
          if (i === 1) {
            return `${+b}`;
          }
          if (i === 2) {
            return `${+b + 9}`;
          }
          if (i === 3) {
            return `${+b - 1}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "z-reverse";
        return globalData.currentBlockArray;
      }

      if (globalData.currentBlockType === "gun") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b - 8}`;
          }
          if (i === 1) {
            return `${+b + 1}`;
          }
          if (i === 2) {
            return `${+b + 10}`;
          }
          if (i === 3) {
            return `${+b - 1}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "gun-vertical";

        return globalData.currentBlockArray;
      }
      if (globalData.currentBlockType === "gun-vertical") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b + 8}`;
          }
          if (i === 1) {
            return `${+b + 8}`;
          }
          if (i === 2) {
            return `${+b}`;
          }
          if (i === 3) {
            return `${+b}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "gun-side";
        return globalData.currentBlockArray;
      }

      if (globalData.currentBlockType === "gun-side") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b}`;
          }
          if (i === 1) {
            return `${+b - 9}`;
          }
          if (i === 2) {
            return `${+b - 1 - 1}`;
          }
          if (i === 3) {
            return `${+b + 10 - 1}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "gun-side-reverse";
        return globalData.currentBlockArray;
      }

      if (globalData.currentBlockType === "gun-side-reverse") {
        const blockArray = globalData.currentBlockArray.map((b, i) => {
          if (i === 0) {
            return `${+b + 10}`;
          }
          if (i === 1) {
            return `${+b + 10}`;
          }
          if (i === 2) {
            return `${+b + 2}`;
          }
          if (i === 3) {
            return `${+b + 2}`;
          }
        });
        globalData.currentBlockArray = blockArray;
        globalData.currentBlockType = "gun";
        return globalData.currentBlockArray;
      }
    }

    if (globalData.currentKeyPress === "ArrowDown") {
      const BlockArray = globalData.currentBlockArray.map((b) => `${+b + 10}`);
      globalData.currentBlockArray = BlockArray;

      return globalData.currentBlockArray;
    }
  }

  // if (globalData.currentBlockType === "bar" && canBlockMove(globalData)) {
  //   if (globalData.currentKeyPress === "ArrowRight") {
  //     const BlockArray = globalData.currentBlockArray.map((b) => `${+b + 1}`);
  //     globalData.currentBlockArray = BlockArray;

  //     return globalData.currentBlockArray;
  //   }
  //   if (globalData.currentKeyPress === "ArrowLeft") {
  //     const BlockArray = globalData.currentBlockArray.map((b) => `${+b - 1}`);
  //     globalData.currentBlockArray = BlockArray;

  //     return globalData.currentBlockArray;
  //   }

  //   if (globalData.currentKeyPress === "ArrowUp") {
  //     return globalData.currentBlockArray;
  //   }

  //   if (globalData.currentKeyPress === "ArrowDown") {
  //     const BlockArray = globalData.currentBlockArray.map((b) => `${+b + 10}`);
  //     globalData.currentBlockArray = BlockArray;

  //     return globalData.currentBlockArray;
  //   }
  // }

  return globalData.currentBlockArray;
}

function canBlockMove(globalData) {
  const dataAboutMove = new BlockMoveData(globalData);
  console.log(dataAboutMove);
  console.log(canFutureBlockExist(globalData, dataAboutMove));
  if (canFutureBlockExist(globalData, dataAboutMove)) return true;

  return false;

  function canFutureBlockExist(globalData, data) {
    console.log(data.isFutureBlockOverGameMap);
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

      const blockSaveData = new LastSavedBlockData(globalData);
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
      // if (data.removedBlockLine.length) {
      //   resetGameData(globalData, data);
      // }
      resetGameData(globalData, data);

      makeBlock(globalData);
      if (globalData.gameRunning) {
        moveBlockDownPerSecond(globalData);
        blockSave(globalData);
      }

      function resetGameData(globalData, data) {
        globalData.currentBlockType = "";
        data.maxHeightBlockLine = data.removedBlockLine.length
          ? data.maxHeightBlockLine + data.removedBlockLine.length
          : data.maxHeightBlockLine;
        // data.maxHeightBlockLine =
        //   data.maxHeightBlockLine + data.removedBlockLine.length;

        data.removedBlockLine = 0;
      }
    }
  }
}
