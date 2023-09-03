export default class BlockLineData {
  #globalData;
  // #originalData;
  #removedBlockLine;
  #numberOfBlockLineTodown;
  #boundryToDown;
  #boundryToTop;
  #minRemovedBlockLine;
  #numberOfBlockLine;
  #isRemainBlockGoDown;
  #isBlockLineRemoved;
  #targetBlockLineNumberArray;
  // constructor(globalData, data) {
  constructor(globalData) {
    this.#globalData = globalData;
    // this.#originalData = data;

    this.#removedBlockLine = this.#globalData.removedBlockLine;

    this.#numberOfBlockLineTodown = this.#removedBlockLine.length;

    this.#boundryToDown =
      this.#globalData.removedBlockLine.length > 0
        ? Math.min(...this.#globalData.removedBlockLine) - 1
        : null;
    // this.#boundryToDown = Number(this.#globalData.removedBlockLine[0]) - 1;

    this.#boundryToTop = this.#globalData.maxHeightBlockLine;
    this.#minRemovedBlockLine = Math.min(...this.#removedBlockLine);
    this.#numberOfBlockLine = this.#boundryToDown - this.#boundryToTop + 1;

    this.#isRemainBlockGoDown = this.isRemainBlockGoDown();
    this.#isBlockLineRemoved = this.isBlockLineRemoved();

    this.#targetBlockLineNumberArray = this.getTargetBlockLineNumberArray();
  }

  get removedBlockLine() {
    return this.#removedBlockLine;
  }

  get numberOfBlockLineTodown() {
    return this.#numberOfBlockLineTodown;
  }
  get boundryToDown() {
    return this.#boundryToDown;
  }
  get boundryToTop() {
    return this.#boundryToTop;
  }
  get minRemovedBlockLine() {
    return this.#minRemovedBlockLine;
  }
  get numberOfBlockLine() {
    return this.#numberOfBlockLine;
  }
  get isRemainBlockGoDown() {
    return this.#isRemainBlockGoDown;
  }
  get isBlockLineRemoved() {
    return this.#isBlockLineRemoved;
  }
  get getBlockLineColors() {
    return this.getBlockLineColors;
  }
  get getBlockLineNumberArray() {
    return this.getBlockLineNumberArray;
  }
  get targetBlockLineNumberArray() {
    return this.#targetBlockLineNumberArray;
  }

  isRemainBlockGoDown() {
    return this.minRemovedBlockLine > this.boundryToTop;
  }

  isBlockLineRemoved() {
    return this.numberOfBlockLineTodown > 0;
  }

  getBlockLineColors(targetBlockLineNumberArray) {
    const result = [];

    targetBlockLineNumberArray.map((b) => {
      const blockColor = window
        .getComputedStyle(
          document.querySelector(`.tetris__gridItem[data-id="${b}"]`)
        )
        .getPropertyValue("background-color");

      result.push(blockColor);
    });

    return result;
  }

  getBlockLineNumberArray(blockLine) {
    const result = [];
    for (let i = 1; i < 11; i++) {
      result.push(blockLine !== 0 ? blockLine * 10 + i : i);
    }

    return result;
  }

  getTargetBlockLineNumberArray() {
    if (this.isBlockLineRemoved && this.isRemainBlockGoDown) {
      const result = [];

      for (let i = 0; i < this.numberOfBlockLine; i++) {
        const targetBlockLine = this.boundryToDown - i;
        const targetBlockLineNumberArray =
          this.getBlockLineNumberArray(targetBlockLine);

        result.push(targetBlockLineNumberArray);
      }
      return result;
    }
  }
}
