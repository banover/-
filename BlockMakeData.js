import { MAX_HEIGHT_OF_GAME_MAP, CENTER_POSITION_NUMBER } from "./config.js";

export default class BlockMakeData {
  #globalData;
  #blockNumberArray;
  #MAX_HEIGHT_OF_GAME_MAP;
  #CENTER_POSITION_NUMBER;
  #isFirstBlock;
  #currentBlockType;
  #currentBlockNumberArray;
  #isBlockTypeBlockLine;
  #isThereEmptySpace;
  constructor(
    globalData,
    blockNumberArray
    // MAX_HEIGHT_OF_GAME_MAP,
    // CENTER_POSITION_NUMBER
  ) {
    this.#globalData = globalData;
    this.#blockNumberArray = blockNumberArray ? blockNumberArray : null;
    this.#MAX_HEIGHT_OF_GAME_MAP = MAX_HEIGHT_OF_GAME_MAP;
    this.#CENTER_POSITION_NUMBER = CENTER_POSITION_NUMBER;
    this.#isFirstBlock =
      this.#globalData.maxHeightBlockLine === this.#MAX_HEIGHT_OF_GAME_MAP
        ? true
        : false;

    this.#currentBlockType = this.#globalData.currentBlockType
      ? globalData.currentBlockType
      : this.getRandomBlockType();
    this.#currentBlockNumberArray = this.#blockNumberArray
      ? this.setBlockNumberArray()
      : this.makeBlockNumberArray();

    this.#isBlockTypeBlockLine = this.#currentBlockType === "blockLine";
    this.#isThereEmptySpace = this.#isFirstBlock
      ? true
      : this.checkIsThereEmptySpace();
  }

  get isFirstBlock() {
    return this.#isFirstBlock;
  }
  get currentBlockType() {
    return this.#currentBlockType;
  }
  get currentBlockNumberArray() {
    return this.#currentBlockNumberArray;
  }
  get isBlockTypeBlockLine() {
    return this.#isBlockTypeBlockLine;
  }
  get isThereEmptySpace() {
    return this.#isThereEmptySpace;
  }

  getRandomBlockType() {
    const blockType = ["squre"];
    const randomNumber = Math.floor(Math.random() * blockType.length);
    const blockTypeNumber = randomNumber === 0 ? randomNumber : 0;
    this.#globalData.currentBlockType = blockType[blockTypeNumber];

    return blockType[blockTypeNumber];
  }

  setBlockNumberArray() {
    this.#globalData.currentBlockArray = this.#blockNumberArray;

    return this.#blockNumberArray;
  }

  makeBlockNumberArray() {
    if (this.currentBlockType === "squre") return this.makeSqureNumberArray();
    // blockType마다 함수 실행시키기
  }

  makeSqureNumberArray() {
    const blockNumber = this.currentBlockNumberArray
      ? this.currentBlockNumberArray
      : [
          `${this.#CENTER_POSITION_NUMBER}`,
          `${this.#CENTER_POSITION_NUMBER + 1}`,
          `${this.#CENTER_POSITION_NUMBER + 10}`,
          `${this.#CENTER_POSITION_NUMBER + 11}`,
        ];

    this.#globalData.currentBlockArray = blockNumber;

    return blockNumber;
  }

  checkIsThereEmptySpace() {
    // if (!this.#blockNumberArray) return true;
    return !this.currentBlockNumberArray.some((b) => {
      const blockColor = window
        .getComputedStyle(
          document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
        )
        .getPropertyValue("background-color");

      return blockColor !== "rgb(255, 255, 255)";
    });
  }
}