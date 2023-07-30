export default class BlockLineData {
  #originalData;
  constructor(data) {
    this.#originalData = data;
  }

  get removedBlockLine() {
    return this.#originalData.removedBlockLine;
  }

  get numberOfBlockLineTodown() {
    return this.removedBlockLine.length;
  }
  get boundryToDown() {
    return Number(this.removedBlockLine[0]) - 1;
  }
  get boundryToTop() {
    return this.#originalData.maxHeightBlockLine;
  }
  get minRemovedBlockLine() {
    return Math.min(...this.removedBlockLine);
  }
  get numberOfBlockLine() {
    return this.boundryToDown - this.boundryToTop + 1;
  }
  get isRemainBlockGoDown() {
    return this.isRemainBlockGoDown();
  }
  get isBlockLineRemoved() {
    return this.isBlockLineRemoved();
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
