// 추후 버그를 대비해서 잠시 내버려둠
export default class EnrichedBlockLineData {
  #inGameData;
  #isBlockLineRemoved;
  #isRemainBlockGoDown;
  #numberOfBlockLine;
  #boundryToDown;
  #getBlockLineNumberArray;
  #getBlockLineColors;
  #removedBlockLine;
  #targetBlockLineNumberArray;
  constructor(inGameData) {
    this.#inGameData = inGameData;
    this.#isBlockLineRemoved = this.#inGameData.isBlockLineRemoved;
    this.#isRemainBlockGoDown = this.#inGameData.isRemainBlockGoDown;
    this.#numberOfBlockLine = this.#inGameData.numberOfBlockLine;
    this.#boundryToDown = this.#inGameData.boundryToDown;
    this.#getBlockLineNumberArray = this.#inGameData.getBlockLineNumberArray;
    this.#getBlockLineColors = this.#inGameData.getBlockLineColors;
    this.#removedBlockLine = this.#inGameData.removedBlockLine;
    this.#targetBlockLineNumberArray = this.getTargetBlockLineNumberArray();
  }

  get isBlockLineRemoved() {
    return this.#isBlockLineRemoved;
  }

  get isRemainBlockGoDown() {
    return this.#isRemainBlockGoDown;
  }

  get numberOfBlockLine() {
    return this.#numberOfBlockLine;
  }

  get boundryToDown() {
    return this.#boundryToDown;
  }

  get getBlockLineNumberArray() {
    return this.#getBlockLineNumberArray;
  }

  get getBlockLineColors() {
    return this.#getBlockLineColors;
  }

  get removedBlockLine() {
    return this.#removedBlockLine;
  }

  get targetBlockLineNumberArray() {
    return this.#targetBlockLineNumberArray;
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
