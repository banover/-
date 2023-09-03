"use strict";

import {
  GAME_MAP_HEIGHT,
  GAME_MAP_WIDTH,
  DEFAULT_SCORE,
  SCORE_PER_ONE_LINE_BLOCK,
  TOTAL_NUMBER_OF_NEXTITEM_GRIDITEM,
} from "./config.js";
import GlobalData from "./GlobalData.js";
import BlockMakeData from "./BlockMakeData.js";
import BlockMoveData from "/BlockMoveData.js";
import LastSavedBlockData from "./LastSavedBlockData.js";
// import EnrichedBlockLineData from "./EnrichedBlockLineData.js";
import BlockLineData from "./BlockLineData.js";
import BlockLineDataForRemove from "./BlockLineDataForRemove.js";
import BlockNumberArray from "./BlockNumberArray.js";
import NextBlockTypeData from "./NextBlockTypeData.js";
import RecordData from "./RecordData.js";

const menu = document.querySelector(".tetris__menu");
const playingBtn = document.querySelector(".tetris__playingBtn");
const recordBtn = document.querySelector(".tetris__checkBtn");
const nextItem = document.querySelector(".tetris__nextItem");
const playingBox = document.querySelector(".tetris__inGameBox");
const scoreBox = document.querySelector(".tetris__scoreBox");
const modal = document.querySelector(".tetris__gameOverModal");
const recodePage = document.querySelector(".tetris__record");
const recode = document.querySelector(".tetris__recordLists");

playingBtn.addEventListener("click", playGame);
recordBtn.addEventListener("click", showRecord);

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
  scoreBox.textContent = `점수: ${DEFAULT_SCORE}`;
}

function makeGameMap() {
  for (let i = 0; i < GAME_MAP_HEIGHT * GAME_MAP_WIDTH; i++) {
    const gridItem = makeGridItem(i);
    playingBox.append(gridItem);
  }
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

function makeNextItem() {
  for (let i = 0; i < TOTAL_NUMBER_OF_NEXTITEM_GRIDITEM; i++) {
    const gridItem = makeNextGridItem(i);
    nextItem.append(gridItem);
  }
}

function makeNextGridItem(i) {
  const gridCell = document.createElement("div");
  gridCell.classList.add("tetris__nextGridItem");
  gridCell.setAttribute("data-id", i + 1);

  return gridCell;
}

function gameStart() {
  const globalData = new GlobalData();
  restartGameHandler(globalData);
  showRecordHandler(globalData);
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
    recordBtn.textContent = "기록확인";
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

function showRecordHandler(globalData) {
  removeOriginalRecordBtnListener();
  // const showRecordToggle = showRecord.bind(null, globalData);
  recordBtn.addEventListener("click", showRecordToggle);

  function showRecordToggle() {
    if (recordBtn.textContent === "돌아가기") {
      changeRecordBtnText();
      closeRecordPage();
      openGameMap();
      openNextItemMap();
      unPauseGame(globalData);

      return;
    }

    if (globalData.gameRunning === false) {
      recordBtn.removeEventListener("click", showRecordToggle);
    }

    if (globalData.gameRunning === true) {
      pauseGame(globalData);
      changeRecordBtnText();
    }

    showRecord(globalData);
  }
}

function removeOriginalRecordBtnListener() {
  recordBtn.removeEventListener("click", showRecord);
}

function changeRecordBtnText() {
  if (recordBtn.textContent === "돌아가기") {
    recordBtn.textContent = "기록확인";
    return;
  }

  recordBtn.textContent = "돌아가기";
}

function unPauseGame(globalData) {
  globalData.pause = false;
}

function pauseGame(globalData) {
  globalData.pause = true;
}

function showRecord(globalData) {
  const recordData = new RecordData(globalData);
  console.log(recordData);

  resetRecordPage();
  presentRecord(makeHtmlRecord(recordData));
  updateUI();
}

function resetRecordPage() {
  recode.textContent = "";
}

function presentRecord(htmlRecordArray) {
  htmlRecordArray.map((htmlRecord) => recode.append(htmlRecord));
}

function makeHtmlRecord(recordData) {
  let result = [];
  for (let i = 0; i < recordData.updatedRecord?.length; i++) {
    const recordList = document.createElement("li");
    recordList.textContent = recordData.updatedRecord[i];

    if (Number(recordData.updatedRecord[i]) === recordData.newRecord) {
      recordList.style.color = "red";
    }
    result.push(recordList);
  }
  return result;
}

function updateUI() {
  recodePage.style.display = "flex";
  modal.style.display = "none";
  playingBox.style.display = "none";
  nextItem.style.display = "none";
}

function makeBlock(globalData, blockNumberArray) {
  const DataAboutMakeBlock = new BlockMakeData(globalData, blockNumberArray);

  if (canBlockBePainted(DataAboutMakeBlock)) {
    return paintBlocks(globalData, DataAboutMakeBlock);
  }

  gameOver(globalData);
}

function canBlockBePainted(data) {
  return data.isThereEmptySpace;
}

function paintBlocks(globalData, data) {
  if (data.isBlockTypeBlockLine) {
    return paintBlockLine(globalData, data.currentBlockNumberArray);
  }

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

function paintBlock(data) {
  data.currentBlockNumberArray.map((item) => {
    const miniBlock = document.querySelector(
      `.tetris__gridItem[data-id="${item}"]`
    );
    miniBlock.style.backgroundColor = `${data.blockColor}`;
  });
}

function gameOver(globalData) {
  showGameOverModal();
  showMenuBar();
  uploadRecord(globalData);
  resetGlobalData(globalData);
}

function showGameOverModal() {
  modal.style.display = "block";
}

function showMenuBar() {
  menu.style.visibility = "visible";
}

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

function makeNextBlock(globalData) {
  const nextBlockTypeNumberArray = new NextBlockTypeData(globalData)
    .nextBlockTypeNumberArray;
  paintNextBlockItem(nextBlockTypeNumberArray);
}

function paintNextBlockItem(nextBlockTypeNumberArray) {
  nextBlockTypeNumberArray.map((item) => {
    const miniBlock = document.querySelector(
      `.tetris__nextGridItem[data-id="${item}"]`
    );
    miniBlock.style.backgroundColor = `white`;
  });
}

function moveBlockDownPerSecond(globalData) {
  globalData.isBlockGoingDown = true;
  const intervalmillisecond = getMoveBlockDownSecond(globalData);

  const setIntervalMoveBlockDown = setInterval(
    moveBlockDown.bind(null, globalData),
    intervalmillisecond
  );

  function moveBlockDown(globalData) {
    if (globalData.pause) return;
    if (globalData.gameRunning === false) {
      clearInterval(setIntervalMoveBlockDown);
      return;
    }
    globalData.currentKeyPress = "ArrowDown";

    canBlockMove(globalData)
      ? moveBlock(globalData)
      : clearIntervalMoveBlockDown(globalData);

    function clearIntervalMoveBlockDown(globalData) {
      clearInterval(setIntervalMoveBlockDown);
      globalData.isBlockGoingDown = false;
    }
  }
}

function getMoveBlockDownSecond(globalData) {
  // test로 만든거임 언제든지 수치 바꾸면 된다.
  if (globalData.score > 5 && globalData.score < 10) {
    return 900;
  } else if (globalData.score > 10 && globalData.score < 20) {
    return 600;
  } else if (globalData.score > 20) {
    return 300;
  }

  return 1000;
}

function canBlockMove(globalData) {
  const dataAboutMove = new BlockMoveData(globalData);

  if (canFutureBlockExist(globalData, dataAboutMove)) return true;
  return false;
}

function canFutureBlockExist(globalData, data) {
  if (
    globalData.currentBlockType !== "blockLine" &&
    data.isFutureBlockOverGameMap
  ) {
    return false;
  }

  return data.canfutureBlockPainted();
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

function keyPressHandler(globalData) {
  const gameKeyHandler = handleGameKeyPad.bind(null, globalData);
  window.addEventListener("keydown", gameKeyHandler);

  function handleGameKeyPad(globalData, e) {
    if (globalData.pause) return;
    if (!globalData.gameRunning) {
      window.removeEventListener("keydown", gameKeyHandler);
      return;
    }

    registerCurrentKeyPress(globalData, e.key);
    if (isArrowKeyPressed(globalData) || isSpaceKeyPressed(globalData)) {
      moveBlock(globalData);
    }
  }
}

function registerCurrentKeyPress(globalData, key) {
  globalData.currentKeyPress = key;
}

function isArrowKeyPressed(globalData) {
  return (
    globalData.currentKeyPress === "ArrowRight" ||
    globalData.currentKeyPress === "ArrowLeft" ||
    globalData.currentKeyPress === "ArrowUp" ||
    globalData.currentKeyPress === "ArrowDown"
  );
}

function isSpaceKeyPressed(globalData) {
  return globalData.currentKeyPress === " ";
}

// 마지막으로 블락이 바닥에 놓이고 다음 블록이 나올 때 까지의 시간을 일정하게 해보자, 지금은 조금 덜일정함

function blockSave(globalData) {
  const setIntervalCheckBlockIsStop = setInterval(
    checkBlockIsStop.bind(null, globalData),
    50
  );

  function checkBlockIsStop(globalData) {
    if (globalData.gameRunning === false) {
      clearInterval(setIntervalCheckBlockIsStop);
      return;
    }

    if (globalData.isBlockGoingDown || globalData.pause) return;

    clearInterval(setIntervalCheckBlockIsStop);

    const blockSaveData = new LastSavedBlockData(globalData);
    removefullColorLine(globalData, blockSaveData);
    moveAllBlockLineToBottom(globalData);
    renderScore(globalData);
    startNextBlock(globalData, blockSaveData);
  }
}

function removefullColorLine(globalData, data) {
  const blockLineData = getBlockLineData(data);
  removeBlockLineFullOfColor(globalData, blockLineData, data);
}

function getBlockLineData(data) {
  const result = [];
  for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
    result.push(new BlockLineDataForRemove(data.lastSavedBlockLines[i]));
  }
  return result;
}

function removeBlockLineFullOfColor(globalData, blockLineData, data) {
  for (let i = 0; i < data.lastSavedBlockLines.length; i++) {
    if (blockLineData[i].isfull) {
      removeBlockLine(blockLineData[i].blockLineNumberArray);

      globalData.removedBlockLine = blockLineData[i].blockLine;
      // 위 코드를 다른 곳으로 뺄 방법이 없을까?
    }
  }
}

function removeBlockLine(numberArray) {
  numberArray.map((b) => {
    document.querySelector(
      `.tetris__gridItem[data-id="${b}"]`
    ).style.backgroundColor = "white";
  });
}

function moveAllBlockLineToBottom(globalData) {
  const inGameData = new BlockLineData(globalData);
  moveAllTargetBlockLineToDown(globalData, inGameData);
}

function moveAllTargetBlockLineToDown(globalData, inGameData) {
  if (inGameData?.targetBlockLineNumberArray?.length) {
    for (let i = 0; i < inGameData.numberOfBlockLine; i++) {
      selectMoveTargetBlock(globalData, inGameData, i);
      settingForMoveBlock(globalData, inGameData, i);

      for (let j = 0; j < inGameData.removedBlockLine.length; j++) {
        moveBlock(globalData);
      }
    }
  }
}

function selectMoveTargetBlock(globalData, inGameData, i) {
  globalData.currentBlockArray = inGameData.targetBlockLineNumberArray[i];
}

function settingForMoveBlock(globalData, inGameData, i) {
  globalData.currentBlockType = "blockLine";

  globalData.blockColorArray = inGameData.getBlockLineColors(
    inGameData.targetBlockLineNumberArray[i]
  );
  globalData.currentKeyPress = "ArrowDown";
}

function renderScore(globalData) {
  if (globalData.removedBlockLine.length) {
    for (let i = 0; i < globalData.removedBlockLine.length; i++) {
      addScore(globalData);
    }

    updateScoreUI(globalData);
  }
}

function addScore(globalData) {
  globalData.score = globalData.score + SCORE_PER_ONE_LINE_BLOCK;
}

function updateScoreUI(globalData) {
  scoreBox.textContent = `점수: ${globalData.score}`;
}

function startNextBlock(globalData, data) {
  resetGameDataForNextBlock(globalData, data);
  makeBlock(globalData);
  makeNextBlock(globalData);
  moveBlockDownPerSecond(globalData);
  blockSave(globalData);
}

function resetGameDataForNextBlock(globalData, data) {
  globalData.currentBlockType = "";
  globalData.maxHeightBlockLine = data.removedBlockLine.length
    ? globalData.maxHeightBlockLine + data.removedBlockLine.length
    : globalData.maxHeightBlockLine;

  globalData.removedBlockLine = 0;
  globalData.justMaked = true;
  clearNextGridItem();
}

function clearNextGridItem() {
  const AllNextGridItem = document.querySelectorAll(".tetris__nextGridItem");

  AllNextGridItem.forEach((gridItem) => {
    gridItem.style.backgroundColor = "black";
  });
}
