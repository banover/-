import { GAME_MAP_HEIGHT } from "./config.js";

export default class LastSavedBlockData {
  #globalData;
  #lastSavedBlockLines;
  #smallestBlockLine;
  #maxHeightBlockLine;
  #removedBlockLine;
  constructor(globalData) {
    this.#globalData = globalData;
    this.currentBlockArray = globalData.currentBlockArray;
    this.GAME_MAP_HEIGHT = GAME_MAP_HEIGHT;

    this.#lastSavedBlockLines = this.getBlockLinesOfLastSavedBlock();
    this.#smallestBlockLine = Math.min(...this.lastSavedBlockLines);
    this.#maxHeightBlockLine = this.getMaxHeightBlockLine();

    this.#removedBlockLine = globalData.removedBlockLine;
  }

  get lastSavedBlockNumberArray() {
    return this.currentBlockArray;
  }

  get lastSavedBlockLines() {
    return this.#lastSavedBlockLines;
  }

  get smallestBlockLine() {
    return this.#smallestBlockLine;
  }

  get maxHeightBlockLine() {
    return this.#maxHeightBlockLine;
  }

  set maxHeightBlockLine(value) {
    this.#globalData.maxHeightBlockLine = value;
  }

  get removedBlockLine() {
    return this.#removedBlockLine;
  }

  set removedBlockLine(value) {
    if (value === 0) {
      this.#globalData.removedBlockLine = value;
    } else {
      this.#globalData.removedBlockLine = value;
    }
  }

  getBlockLinesOfLastSavedBlock() {
    const blockLineArray = this.lastSavedBlockNumberArray
      .map((b) => (b / 10 === 0 ? 0 : Math.floor(b / 10)))
      .filter((b) => b < this.GAME_MAP_HEIGHT);

    return [...new Set(blockLineArray)];
    // 개선하자면 굳이 lastSavedBlockNumberArray를 다 map하기보다는 부분만 사용하겠금...
  }

  getMaxHeightBlockLine() {
    if (this.smallestBlockLine < this.#globalData.maxHeightBlockLine) {
      this.#globalData.maxHeightBlockLine = this.smallestBlockLine;
    }
    return this.#globalData.maxHeightBlockLine;
  }
}
