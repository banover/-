"use strict";

import {
  GAME_MAP_HEIGHT,
  MAX_HEIGHT_OF_GAME_MAP,
  CENTER_POSITION_NUMBER,
  DEFAULT_SCORE,
  SCORE_PER_ONE_LINE_BLOCK,
  NEXT_BLOCK_CENTER_POSITION_NUMBER,
  TOTAL_NUMBER_OF_NEXTITEM_GRIDITEM,
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
import RecordData from "./RecordData.js";

const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const checkBtn = document.querySelector(".tetris__checkBtn");
const nextItem = document.querySelector(".tetris__nextItem");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");
const modal = document.querySelector(".tetris__gameOverModal");
const recodePage = document.querySelector(".tetris__record");
const recode = document.querySelector(".tetris__recordLists");

playingBtn.addEventListener("click", playGame);
checkBtn.addEventListener("click", manageRecord);

// **********************************************************************
// 여기서부터는 함수
// **********************************************************************

function playGame() {
  resetUi();
  makeGameMap();
  makeNextItem();
  gameStart();
}

function resetUi() {
  closeRecordPage();
  openGameMap();
  openNextItemMap();
  resetGameMap();
  resetNextItemMap();
  resetScore();
}

function closeRecordPage() {
  recodePage.style.display = "none";
}

function openGameMap() {
  playingBox.style.display = "grid";
}

function openNextItemMap() {
  nextItem.style.display = "grid";
}

function resetGameMap() {
  playingBox.textContent = "";
}

function resetNextItemMap() {
  nextItem.textContent = "";
}

function resetScore() {
  scoreBox.textContent = `점수: 0`;
}

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
  for (let i = 0; i < TOTAL_NUMBER_OF_NEXTITEM_GRIDITEM; i++) {
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
  restartGameHandler(globalData);
  checkRecordHandler(globalData);
  makeBlock(globalData);
  makeNextBlock(globalData);
  moveBlockDownPerSecond(globalData);
  keyPressHandler(globalData);
  blockSave(globalData);
}

function restartGameHandler(globalData) {
  changePlayingBtnText();
  removeOriginalPlayingBtnListener();
  addPlayingBtnGameRestartListener(globalData);
}

function changePlayingBtnText() {
  if ((playingBtn.textContent = "시작")) {
    playingBtn.textContent = "다시하기";
  }
  if (playingBtn.textContent === "다시하기") {
    checkBtn.textContent = "기록확인";
  }
}

function removeOriginalPlayingBtnListener() {
  playingBtn.removeEventListener("click", playGame);
}

function addPlayingBtnGameRestartListener(globalData) {
  playingBtn.addEventListener("click", gameRestart);

  function gameRestart() {
    playingBtn.removeEventListener("click", gameRestart);
    resetGlobalData(globalData);
    playGame();
  }
}

function resetGlobalData(globalData) {
  globalData.reset = true;
}

function checkRecordHandler(globalData) {
  checkBtn.removeEventListener("click", manageRecord);
  // checkBtn.addEventListener("click", showRecord);
  const showRecordToggle = showRecord.bind(null, globalData);
  // checkBtn.addEventListener("click", showRecord.bind(null, globalData));
  checkBtn.addEventListener("click", showRecordToggle);
  // if (checkBtn.textContent === "돌아가기") {
  //   checkBtn.textContent = "기록확인";
  // }

  function showRecord(globalData) {
    // if (globalData.gameRunning === false) return;
    if (checkBtn.textContent === "돌아가기") {
      checkBtn.textContent = "기록확인";
      recodePage.style.display = "none";
      nextItem.style.display = "grid";
      playingBox.style.display = "grid";
      globalData.pause = false;

      return;
    }

    if (globalData.gameRunning === false) {
      console.log("removeEvent");
      checkBtn.removeEventListener("click", showRecordToggle);
    }

    if (globalData.gameRunning === true) {
      globalData.pause = true;
      checkBtn.textContent = "돌아가기";
    }

    manageRecord(globalData);
  }
}

function manageRecord(globalData) {
  console.log("manageRecord 진입!");
  const recordData = new RecordData(globalData);
  showRecord(recordData, globalData);
}

function showRecord(recordData, globalData) {
  makeHtmlRecord(recordData, globalData);
  updateUI();

  function makeHtmlRecord(recordData) {
    recode.textContent = "";
    for (let i = 0; i < recordData.updatedRecord.length; i++) {
      const recordList = document.createElement("li");
      recordList.textContent = recordData.updatedRecord[i];
      // if (
      //   recordData.updatedRecord[i] === null ||
      //   recordData.updatedRecord[i] === undefined
      // ) {
      //   continue;
      // }
      if (Number(recordData.updatedRecord[i]) === recordData.newRecord) {
        recordList.style.color = "red";
      }
      recode.append(recordList);
    }
  }

  function updateUI() {
    recodePage.style.display = "flex";
    modal.style.display = "none";
    playingBox.style.display = "none";
    nextItem.style.display = "none";
  }
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

    uploadRecord(globalData);
    // manageRecord(globalData);
    globalData.reset = true;

    function uploadRecord(globalData) {
      let recordArray = JSON.parse(localStorage.getItem("score"));
      if (!recordArray) {
        localStorage.setItem("score", JSON.stringify([globalData.score]));
        return;
      }
      recordArray.push(globalData.score);
      recordArray.sort((a, b) => b - a);
      localStorage.setItem("score", JSON.stringify(recordArray.slice(0, 5)));
    }
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
    if (globalData.pause) return;
    console.log(globalData.gameRunning);
    if (globalData.gameRunning === false) {
      clearInterval(setIntervalMoveBlockDown);
      return;
    }
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
  window.addEventListener(
    "keydown",
    handleGameKeyPad.bind(null, globalData)

    // function handleGameKeyPad(e, globalData) {
    //   if (!globalData.gameRunning) return;
    //   if (isArrowKeyPressed(globalData, e.key)) moveBlock(globalData);
    //   if (isSpaceKeyPressed(globalData, e.key)) moveBlock(globalData);
    // }

    // function isArrowKeyPressed(globalData, key) {
    //   globalData.currentKeyPress = key;

    //   return (
    //     globalData.currentKeyPress === "ArrowRight" ||
    //     globalData.currentKeyPress === "ArrowLeft" ||
    //     globalData.currentKeyPress === "ArrowUp" ||
    //     globalData.currentKeyPress === "ArrowDown"
    //   );
    // }

    // function isSpaceKeyPressed(globalData, key) {
    //   globalData.currentKeyPress = key;

    //   return globalData.currentKeyPress === " ";
    // }
    // }
  );
  function handleGameKeyPad(globalData, e) {
    // if (!globalData.gameRunning) return;
    if (globalData.pause) return;
    if (!globalData.gameRunning) {
      window.removeEventListener("keydown", handleGameKeyPad);
      return;
    }
    if (isArrowKeyPressed(globalData, e.key)) moveBlock(globalData);
    if (isSpaceKeyPressed(globalData, e.key)) moveBlock(globalData);
  }

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
}

// 마지막으로 블락이 바닥에 놓이고 다음 블록이 나올 때 까지의 시간을 일정하게 해보자, 지금은 조금 덜일정함

function blockSave(globalData) {
  const setIntervalCheckBlockIsStop = setInterval(
    checkBlockIsStop.bind(null, globalData),
    50
  );

  function checkBlockIsStop(globalData) {
    console.log(globalData.gameRunning);
    if (globalData.gameRunning === false) {
      clearInterval(setIntervalCheckBlockIsStop);
      return;
    }
    console.log(globalData.pause);
    if (globalData.isBlockGoingDown || globalData.pause) return;

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
      console.log(globalData.pause);
      console.log("startNExtBlcok 통과");
      // if (globalData.pause) return;
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
