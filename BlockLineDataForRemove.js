export default class BlockLineDataForRemove {
  #blockLine;
  constructor(blockLine) {
    this.#blockLine = blockLine;
  }

  get blockLine() {
    return this.#blockLine;
  }
  get blockLineNumberArray() {
    return this.getBlockLineNumberArray();
  }
  get isWhiteBlock() {
    return this.isWhiteBlock;
  }
  get isfull() {
    return this.CheckFullColorLine();
  }

  getBlockLineNumberArray() {
    const result = [];
    for (let i = 1; i < 11; i++) {
      result.push(this.blockLine !== 0 ? this.blockLine * 10 + i : i);
    }

    return result;
  }

  isWhiteBlock(blockNumber) {
    const BlockColor = window
      .getComputedStyle(
        document.querySelector(`.tetris__gridItem[data-id="${blockNumber}"]`)
      )
      .getPropertyValue("background-color");

    return BlockColor === "rgb(255, 255, 255)";
  }

  CheckFullColorLine() {
    return !this.blockLineNumberArray.some((blockNumber) =>
      this.isWhiteBlock(blockNumber)
    );
  }
}
