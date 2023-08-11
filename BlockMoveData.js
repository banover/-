import { GAME_MAP_HEIGHT } from "./config.js";

export default class BlockMoveData {
  #globalData;
  #futureBlockArray;
  #isBlockOverRightGameMap;
  #isBlockOverLeftGameMap;
  #isBlockOverBottomGameMap;
  #isBlockOverTopGameMap;
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
    this.#isBlockOverTopGameMap = this.BlockOverTopGameMap();
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
  get isBlockOverTopGameMap() {
    return this.#isBlockOverTopGameMap;
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
      return this.#globalData.currentBlockArray.map((b) => +b - 1);
      // .filter((b) => !this.#globalData.currentBlockArray.includes(`${b}`));
    }

    if (this.#globalData.currentKeyPress === "ArrowRight") {
      return this.#globalData.currentBlockArray.map((b) => +b + 1);
      // .filter((b) => !this.#globalData.currentBlockArray.includes(`${b}`));
    }

    if (this.#globalData.currentKeyPress === "ArrowDown") {
      return this.#globalData.currentBlockArray
        .map((b) => +b + 10)
        .filter((b) => !this.#globalData.currentBlockArray.includes(`${b}`));
    }

    if (this.#globalData.currentKeyPress === "ArrowUp") {
      if (this.#globalData.currentBlockType === "bar") {
        const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
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
        return blockArray;
      }

      if (this.#globalData.currentBlockType === "bar-vertical") {
        const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
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
        return blockArray;
      }

      if (this.#globalData.currentBlockType === "z") {
        const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
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
        return blockArray;
      }
      if (this.#globalData.currentBlockType === "z-vertical") {
        const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
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
        return blockArray;
      }

      if (this.#globalData.currentBlockType === "z-reverse") {
        const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
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
        return blockArray;
      }
      if (this.#globalData.currentBlockType === "z-reverse-vertical") {
        const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
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
        return blockArray;
      }
    }

    return this.#globalData.currentBlockArray;
  }

  BlockOverRightGameMap() {
    if (this.#globalData.currentBlockType === "bar-vertical") {
      return (
        this.#globalData.currentBlockArray.some((b) => b % 10 === 0) &&
        this.futureBlockArray.some((b) => b % 10 === 1)
      );
    }
    return (
      // this.#globalData.currentBlockArray.some((b) => b % 10 === 0) &&
      this.futureBlockArray.some((b) => b % 10 === 0) &&
      this.futureBlockArray.some((b) => b % 10 === 1)
    );
  }

  BlockOverLeftGameMap() {
    if (this.#globalData.currentBlockType === "bar-vertical") {
      if (
        this.#globalData.currentBlockArray.some((b) => b % 10 === 1) &&
        this.futureBlockArray.some((b) => b % 10 === 0)
      ) {
        return true;
      }
    }
    return (
      // this.#globalData.currentBlockArray.some((b) => b % 10 === 1) &&
      this.futureBlockArray.some((b) => b % 10 === 1) &&
      this.futureBlockArray.some((b) => b % 10 === 0)
    );
  }

  BlockOverBottomGameMap() {
    return this.futureBlockArray.some((b) => +b > this.GAME_MAP_HEIGHT * 10);
  }

  BlockOverTopGameMap() {
    return this.futureBlockArray.some((b) => +b < 1);
  }

  FutureBlockOverGameMap() {
    return this.isBlockOverRightGameMap ||
      this.isBlockOverLeftGameMap ||
      this.isBlockOverBottomGameMap ||
      this.isBlockOverTopGameMap
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
