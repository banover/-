import { MAX_HEIGHT_OF_GAME_MAP, CENTER_POSITION_NUMBER } from "./config.js";

export default class BlockMakeData {
  #globalData;
  #blockNumberArray;
  #MAX_HEIGHT_OF_GAME_MAP;
  #CENTER_POSITION_NUMBER;
  #isFirstBlock;
  #nextBlockType;
  #currentBlockType;
  #currentBlockNumberArray;
  #isBlockTypeBlockLine;
  #isThereEmptySpace;
  #blockColor;
  constructor(globalData, blockNumberArray) {
    this.#globalData = globalData;
    this.#blockNumberArray = blockNumberArray ? blockNumberArray : null;
    this.#MAX_HEIGHT_OF_GAME_MAP = MAX_HEIGHT_OF_GAME_MAP;
    this.#CENTER_POSITION_NUMBER = CENTER_POSITION_NUMBER;
    this.#isFirstBlock =
      this.#globalData.maxHeightBlockLine === this.#MAX_HEIGHT_OF_GAME_MAP &&
      this.#globalData.score === 0
        ? true
        : false;

    this.#nextBlockType = this.#globalData.nextBlockType
      ? [`${this.#globalData.nextBlockType}`]
      : [`${this.getRandomBlockType()}`];

    this.#currentBlockType = this.getBlockType();

    // this.#currentBlockType = this.#globalData.currentBlockType
    //   ? globalData.currentBlockType
    //   : this.getRandomBlockType();

    this.#currentBlockNumberArray = this.#blockNumberArray
      ? this.setBlockNumberArray()
      : this.makeBlockNumberArray();

    this.#isBlockTypeBlockLine = this.#currentBlockType === "blockLine";
    this.#isThereEmptySpace = this.#isFirstBlock
      ? true
      : this.checkIsThereEmptySpace();

    this.#blockColor = this.getRandomColor();
  }

  get isFirstBlock() {
    return this.#isFirstBlock;
  }
  get nextBlockType() {
    return this.#nextBlockType;
    // return this.#globalData.nextBlockType;
  }
  set nextBlockType(value) {
    this.#globalData.nextBlockType = this.getRandomBlockType();
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
  get blockColor() {
    return this.#blockColor;
  }

  getRandomBlockType() {
    const blockType = [
      "squre",
      "bar",
      "z",
      "z-reverse",
      "gun",
      "gun-reverse",
      "balance",
    ];
    // const blockType = ["balance"];
    const randomNumber = Math.floor(Math.random() * blockType.length);
    // const blockTypeNumber = randomNumber === 0 ? randomNumber : 0;
    const blockTypeNumber = randomNumber;
    // this.#globalData.currentBlockType = blockType[blockTypeNumber];
    // console.log(randomNumber);

    return blockType[blockTypeNumber];
  }

  getBlockType() {
    if (this.#globalData.currentBlockType) {
      return this.#globalData.currentBlockType;
    }
    if (this.nextBlockType.length && !this.isFirstBlock) {
      this.#globalData.currentBlockType = this.nextBlockType[0];
      this.nextBlockType = "remove first item and push a new random BlockType";
      return this.#globalData.currentBlockType;
    }
    const newBlockType = this.getRandomBlockType();
    this.#globalData.nextBlockType = this.nextBlockType[0];
    this.#globalData.currentBlockType = newBlockType;

    return newBlockType;
  }

  setBlockNumberArray() {
    this.#globalData.currentBlockArray = this.#blockNumberArray;

    return this.#blockNumberArray;
  }

  makeBlockNumberArray() {
    if (this.currentBlockType === "blockLine")
      return this.#globalData.currentBlockArray;
    if (this.currentBlockType === "squre") return this.makeSqureNumberArray();
    if (this.currentBlockType === "bar") return this.makeBarNumberArray();
    if (this.currentBlockType === "z") return this.makeZNumberArray();
    if (this.currentBlockType === "z-reverse")
      return this.makeZreverseNumberArray();

    if (this.currentBlockType === "gun") return this.makeGunNumberArray();
    if (this.currentBlockType === "gun-reverse")
      return this.makeGunReverseNumberArray();
    if (this.currentBlockType === "balance")
      return this.makeBalanceNumberArray();
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

  makeBarNumberArray() {
    const blockNumber = this.currentBlockNumberArray
      ? this.currentBlockNumberArray
      : [
          `${this.#CENTER_POSITION_NUMBER - 1}`,
          `${this.#CENTER_POSITION_NUMBER}`,
          `${this.#CENTER_POSITION_NUMBER + 1}`,
          `${this.#CENTER_POSITION_NUMBER + 2}`,
        ];

    this.#globalData.currentBlockArray = blockNumber;

    return blockNumber;
  }

  makeZNumberArray() {
    const blockNumber = this.currentBlockNumberArray
      ? this.currentBlockNumberArray
      : [
          `${this.#CENTER_POSITION_NUMBER - 1}`,
          `${this.#CENTER_POSITION_NUMBER}`,
          `${this.#CENTER_POSITION_NUMBER + 10}`,
          `${this.#CENTER_POSITION_NUMBER + 11}`,
        ];

    this.#globalData.currentBlockArray = blockNumber;

    return blockNumber;
  }

  makeZreverseNumberArray() {
    const blockNumber = this.currentBlockNumberArray
      ? this.currentBlockNumberArray
      : [
          `${this.#CENTER_POSITION_NUMBER}`,
          `${this.#CENTER_POSITION_NUMBER + 1}`,
          `${this.#CENTER_POSITION_NUMBER + 9}`,
          `${this.#CENTER_POSITION_NUMBER + 10}`,
        ];

    this.#globalData.currentBlockArray = blockNumber;

    return blockNumber;
  }
  makeGunNumberArray() {
    const blockNumber = this.currentBlockNumberArray
      ? this.currentBlockNumberArray
      : [
          `${this.#CENTER_POSITION_NUMBER - 1}`,
          `${this.#CENTER_POSITION_NUMBER}`,
          `${this.#CENTER_POSITION_NUMBER + 1}`,
          `${this.#CENTER_POSITION_NUMBER + 11}`,
        ];

    this.#globalData.currentBlockArray = blockNumber;

    return blockNumber;
  }

  makeGunReverseNumberArray() {
    const blockNumber = this.currentBlockNumberArray
      ? this.currentBlockNumberArray
      : [
          `${this.#CENTER_POSITION_NUMBER - 1}`,
          `${this.#CENTER_POSITION_NUMBER}`,
          `${this.#CENTER_POSITION_NUMBER + 1}`,
          `${this.#CENTER_POSITION_NUMBER + 9}`,
        ];

    this.#globalData.currentBlockArray = blockNumber;

    return blockNumber;
  }

  makeBalanceNumberArray() {
    const blockNumber = this.currentBlockNumberArray
      ? this.currentBlockNumberArray
      : [
          `${this.#CENTER_POSITION_NUMBER}`,
          `${this.#CENTER_POSITION_NUMBER + 9}`,
          `${this.#CENTER_POSITION_NUMBER + 10}`,
          `${this.#CENTER_POSITION_NUMBER + 11}`,
        ];

    this.#globalData.currentBlockArray = blockNumber;

    return blockNumber;
  }

  checkIsThereEmptySpace() {
    return !this.currentBlockNumberArray.some((b) => {
      const blockColor = window
        .getComputedStyle(
          document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
        )
        .getPropertyValue("background-color");

      return blockColor !== "rgb(255, 255, 255)";
    });
  }

  getRandomColor() {
    const colorType = ["red", "blue", "green"];
    const randomNumber = Math.floor(Math.random() * colorType.length);

    if (this.#globalData.justMaked) {
      this.#globalData.currentBlockColor = colorType[randomNumber];
      this.#globalData.justMaked = false;
      return colorType[randomNumber];
    }

    return this.#globalData.currentBlockColor;
  }
}
