"use strict";

import GlobalData from "./globalData.js";
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

// let currentBlockArray;

// let currentBlockType;
// let currentKeyPress;
// let lastSavedBlockNumberArray;
// let lastSavedBlockLine;
// let maxHeightBlockLine = MAX_HEIGHT_OF_GAME_MAP;
// let removedBlockLine = [];
// let blockColorArray;
// // let shouldBeRemoved;
// // let turn = true;
// let isBlockGoingDown;
// let score = DEFAULT_SCORE;
// let gameRunning = true;

function playGame() {
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
  console.log("gameStart 진입");

  const globalData = new GlobalData(MAX_HEIGHT_OF_GAME_MAP, DEFAULT_SCORE);
  // makeBlock();
  // moveBlockDownPerSecond();
  // keyPressHandler();
  // blockSave();
  console.log("makeblock 진입");
  makeBlock(globalData);
  console.log("moveBlockDownperSecond 진입");
  moveBlockDownPerSecond(globalData);
  keyPressHandler(globalData);
  blockSave(globalData);
}

function makeBlock(globalData, blockNumberArray) {
  const DataAboutMakeBlock = getDataAboutMakeBlock(
    globalData,
    blockNumberArray
  );
  console.log(DataAboutMakeBlock);
  paintBlocks(globalData, DataAboutMakeBlock);

  function getDataAboutMakeBlock(globalData, blockNumberArray) {
    console.log(blockNumberArray);
    const result = {};

    result.isFirstBlock =
      globalData.maxHeightBlockLine === MAX_HEIGHT_OF_GAME_MAP ? true : false;

    result.currentBlockType = globalData.currentBlockType
      ? globalData.currentBlockType
      : getRandomBlockType(globalData);

    console.log(result.currentBlockType);

    result.currentBlockNumberArray = blockNumberArray
      ? setBlockNumberArray(globalData, blockNumberArray)
      : makeBlockNumberArray(globalData, result);

    console.log(result.currentBlockNumberArray);

    result.isBlockTypeBlockLine = result.currentBlockType === "blockLine";
    console.log(result.isBlockTypeBlockLine);
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
    // globalData.currentBlockType(blockType[blockTypeNumber]);
    // currentBlockType = blockType[blockTypeNumber];
    return blockType[blockTypeNumber];
  }

  function setBlockNumberArray(globalData, blockNumberArray) {
    console.log(blockNumberArray);
    globalData.currentBlockArray = blockNumberArray;
    // globalData.currentBlockArray(blockNumberArray);
    // currentBlockArray = blockNumberArray;
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
    // currentBlockArray = blockNumber;

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
    // blockColorArray = [];
  }
  // }

  function gameOver(globalData) {
    modal.style.display = "block";
    menu.style.visibility = "visible";
    globalData.gameRunning(false);
    // gameRunning = false;
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
  console.log("moveBlock 진입");
  console.log(globalData);
  removeCurrentBlock(globalData);
  makeBlock(globalData, makeNewBlockNumberArray(globalData));
}

function removeCurrentBlock(globalData) {
  console.log("removeCurrentBlock 진입");
  console.log(globalData);
  globalData.currentBlockArray.map((b) => {
    // currentBlockArray.map((b) => {
    console.log(b);
    const miniBlock = document.querySelector(
      `.tetris__gridItem[data-id="${b}"]`
    );
    miniBlock.style.backgroundColor = "white";
  });
}

function makeNewBlockNumberArray(globalData) {
  // blockline에서 canblockmove할필요가 잇나?
  if (globalData.currentBlockType === "blockLine" && canBlockMove(globalData)) {
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
      console.log("canFutureBlockExitst 통과");
      return false;
    }

    return data.canfutureBlockPainted(data);
  }
}

function moveBlockDownPerSecond(globalData) {
  globalData.isBlockGoingDown = true;
  // globalData.isBlockGoingDown(true);
  // isBlockGoingDown = true;
  const setIntervalMoveBlockDown = setInterval(
    moveBlockDown.bind(null, globalData),
    1000
  );

  function moveBlockDown(globalData) {
    globalData.currentKeyPress = "ArrowDown";
    // globalData.currentKeyPress("ArrowDown");
    // currentKeyPress = "ArrowDown";
    console.log(canBlockMove(globalData));
    canBlockMove(globalData)
      ? moveBlock(globalData)
      : clearIntervalMoveBlockDown(globalData);
  }

  function clearIntervalMoveBlockDown() {
    clearInterval(setIntervalMoveBlockDown);
    globalData.isBlockGoingDown = false;
    // globalData.isBlockGoingDown(false);
    // isBlockGoingDown = false;
    // turn = false;
  }
}

function keyPressHandler(globalData) {
  window.addEventListener("keydown", (e) => {
    if (isArrowKeyPressed(globalData, e.key)) moveBlock(globalData);

    function isArrowKeyPressed(globalData, key) {
      globalData.currentKeyPress = key;
      // globalData.currentKeyPress(key);
      // currentKeyPress = key;

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
  // const setIntervalCheckBlockIsStop = setInterval(checkBlockIsStop, 500); checkBlockIsStop.bind(null, data) 이런식으로 data 넣을 수 있음
  // data와 로직을 분리하자!
  const setIntervalCheckBlockIsStop = setInterval(
    checkBlockIsStop.bind(null, globalData),
    500
  );

  function checkBlockIsStop(globalData) {
    // if (!isBlockGoingDown && !turn) {
    if (!globalData.isBlockGoingDown) {
      clearInterval(setIntervalCheckBlockIsStop);
      // turn = true;
      // const blockSaveData = setDataAboutLastSavedBlock(globalData);
      const blockSaveData = new LastSavedBlockData(globalData, GAME_MAP_HEIGHT);
      removefullColorLine(globalData, blockSaveData);
      moveAllBlockLineToBottom(globalData, blockSaveData);
      renderScore(globalData);
      startNextBlock(globalData, blockSaveData);
      // // keyPressHandler();          ******* keyPressHandler가 한번 이상 설정되면 두번적용되서 두칸이 이동함 주의*******
    }

    function setDataAboutLastSavedBlock(globalData) {
      const result = {};

      result.lastSavedBlockNumberArray =
        getLastSavedBlockNumberArray(globalData);
      result.lastSavedBlockLines = getBlockLinesOfLastSavedBlock();
      result.smallestBlockLine = Math.min(...result.lastSavedBlockLines);
      result.maxHeightBlockLine = getMaxHeightBlockLine(globalData);
      result.removedBlockLine = [];

      return result;

      function getLastSavedBlockNumberArray(globalData) {
        globalData.lastSavedBlockNumberArray(globalData.currentBlockArray);
        // lastSavedBlockNumberArray = currentBlockArray;
        return globalData.lastSavedBlockNumberArray;
      }

      function getBlockLinesOfLastSavedBlock() {
        const blockLineArray = result.lastSavedBlockNumberArray
          .map((b) => (b / 10 === 0 ? 0 : Math.floor(b / 10)))
          .filter((b) => b < GAME_MAP_HEIGHT);

        return [...new Set(blockLineArray)];
        // 개선하자면 굳이 lastSavedBlockNumberArray를 다 map하기보다는 부분만 사용하겠금...
      }

      function getMaxHeightBlockLine(globalData) {
        if (result.smallestBlockLine < globalData.maxHeightBlockLine) {
          globalData.maxHeightBlockLine(result.smallestBlockLine);
          // maxHeightBlockLine = result.smallestBlockLine;
        }
        return globalData.maxHeightBlockLine;
      }
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
        console.log(blockLineData);
        for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
          console.log(blockLineData[i].isfull);
          if (blockLineData[i].isfull) {
            removeBlockLine(blockLineData[i].blockLineNumberArray);
            // data.removedBlockLine.push(blockLineData[i].blockLine);
            // globalData.removedBlockLine = blockLineData[i].blockLine; 이게 필요없을 수도..?
            data.removedBlockLine = blockLineData[i].blockLine;
            // data.removedBlockLine(blockLineData[i].blockLine);
            // LastSavedBlockData class를 활용하게 되면 위 코드로 대체해야 한다.

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
    }

    function getBlockLineNumberArray(blockLine) {
      const result = [];
      for (let i = 1; i < 11; i++) {
        result.push(blockLine !== 0 ? blockLine * 10 + i : i);
      }

      return result;
    }

    function moveAllBlockLineToBottom(globalData, data) {
      console.log(data);
      const inGameData = new BlockLineData(data);
      moveRemainBlockDown(globalData, inGameData);

      function moveRemainBlockDown(globalData, inGameData) {
        console.log(inGameData);
        const enrichedData = new EnrichedBlockLineData(inGameData);
        moveTargetBlockLineToDown(globalData, enrichedData);

        function moveTargetBlockLineToDown(globalData, enrichedData) {
          console.log(enrichedData);
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
                // currentBlockArray = currentBlockArray.map((b) => +b + 10);
              }
            }
          }
          // currentBlockType = "";
        }
      }
    }

    function renderScore(globalData) {
      const scoreElement = document.querySelector(".tetris__scoreBox");
      if (globalData.removedBlockLine.length) {
        for (let i = 0; i < globalData.removedBlockLine.length; i++) {
          addScore(globalData);
        }
      }
      scoreElement.textContent = `점수: ${globalData.score}`;

      function addScore(globalData) {
        globalData.score(globalData.score + SCORE_PER_ONE_LINE_BLOCK);
        // score += SCORE_PER_ONE_LINE_BLOCK;
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
        // data.maxHeightBlockLine(
        //   data.maxHeightBlockLine + data.removedBlockLine.length
        // );
        // data.maxHeightBlockLine += data.removedBlockLine.length;
        data.removedBlockLine = 0;
        // data.removedBlockLine(0);
        // data.removedBlockLine.length = 0;
        //
      }
    }
  }
}
