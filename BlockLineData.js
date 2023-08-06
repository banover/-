export default class BlockLineData {
  #originalData;
  #removedBlockLine;
  #numberOfBlockLineTodown;
  #boundryToDown;
  #boundryToTop;
  #minRemovedBlockLine;
  #numberOfBlockLine;
  #isRemainBlockGoDown;
  #isBlockLineRemoved;
  constructor(data) {
    this.#originalData = data;
    this.#removedBlockLine = this.#originalData.removedBlockLine;
    this.#numberOfBlockLineTodown = this.removedBlockLine.length;
    this.#boundryToDown = Number(this.removedBlockLine[0]) - 1;
    this.#boundryToTop = this.#originalData.maxHeightBlockLine;
    this.#minRemovedBlockLine = Math.min(...this.removedBlockLine);
    this.#numberOfBlockLine = this.boundryToDown - this.boundryToTop + 1;
    this.#isRemainBlockGoDown = this.isRemainBlockGoDown();
    this.#isBlockLineRemoved = this.isBlockLineRemoved();
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
}
