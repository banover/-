import { GAME_MAP_HEIGHT } from "./config.js";

export default class BlockMoveData {
  #globalData;
  #futureBlockArray;
  #isBlockOverRightGameMap;
  #isBlockOverLeftGameMap;
  #isBlockOverBottomGameMap;
  #isFutureBlockOverGameMap;
  #isAlreadyBlockThere;
  #canfutureBlockPainted;

  constructor(globalData) {
    this.#globalData = globalData;
    this.GAME_MAP_HEIGHT = GAME_MAP_HEIGHT;
    this.#futureBlockArray = this.makeFutureBlockArray();
    this.#isBlockOverRightGameMap = this.BlockOverRightGameMap();
    this.#isBlockOverLeftGameMap = this.BlockOverLeftGameMap();
    this.#isBlockOverBottomGameMap = this.BlockOverBottomGameMap();
    this.#isFutureBlockOverGameMap = this.FutureBlockOverGameMap();
    this.#isAlreadyBlockThere = this.AlreadyBlockThere;
    this.#canfutureBlockPainted = this.checkCanfutureBlockPainted;
  }

  get futureBlockArray() {
    return this.#futureBlockArray;
  }

  get isBlockOverRightGameMap() {
    return this.#isBlockOverRightGameMap;
  }
  get isBlockOverLeftGameMap() {
    return this.#isBlockOverLeftGameMap;
  }
  get isBlockOverBottomGameMap() {
    return this.#isBlockOverBottomGameMap;
  }
  get isFutureBlockOverGameMap() {
    return this.#isFutureBlockOverGameMap;
  }
  get isAlreadyBlockThere() {
    return this.#isAlreadyBlockThere;
  }
  get canfutureBlockPainted() {
    return this.#canfutureBlockPainted;
  }

  makeFutureBlockArray() {
    if (this.#globalData.currentKeyPress === "ArrowLeft") {
      return this.#globalData.currentBlockArray
        .map((b) => +b - 1)
        .filter((b) => !this.#globalData.currentBlockArray.includes(`${b}`));
    }

    if (this.#globalData.currentKeyPress === "ArrowRight") {
      return this.#globalData.currentBlockArray
        .map((b) => +b + 1)
        .filter((b) => !this.#globalData.currentBlockArray.includes(`${b}`));
    }

    if (this.#globalData.currentKeyPress === "ArrowDown") {
      return this.#globalData.currentBlockArray
        .map((b) => +b + 10)
        .filter((b) => !this.#globalData.currentBlockArray.includes(`${b}`));
    }

    if (this.#globalData.currentKeyPress === "ArrowUp")
      return this.#globalData.currentBlockArray;
  }

  BlockOverRightGameMap() {
    return (
      this.#globalData.currentBlockArray.some((b) => b % 10 === 0) &&
      this.futureBlockArray.some((b) => b % 10 === 1)
    );
  }

  BlockOverLeftGameMap() {
    return (
      this.#globalData.currentBlockArray.some((b) => b % 10 === 1) &&
      this.futureBlockArray.some((b) => b % 10 === 0)
    );
  }

  BlockOverBottomGameMap() {
    return this.futureBlockArray.some((b) => +b > this.GAME_MAP_HEIGHT * 10);
  }

  FutureBlockOverGameMap() {
    return this.isBlockOverRightGameMap ||
      this.isBlockOverLeftGameMap ||
      this.isBlockOverBottomGameMap
      ? true
      : false;
  }

  AlreadyBlockThere(futureBlock) {
    const futureBlockColor = window
      .getComputedStyle(
        document.querySelector(`.tetris__gridItem[data-id="${futureBlock}"]`)
      )
      .getPropertyValue("background-color");

    return futureBlockColor !== "rgb(255, 255, 255)";
  }

  checkCanfutureBlockPainted() {
    return !this.futureBlockArray.some((b) => this.isAlreadyBlockThere(b));
  }
}
