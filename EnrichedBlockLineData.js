export default class EnrichedBlockLineData {
  #inGameData;
  constructor(inGameData) {
    this.#inGameData = inGameData;
  }

  get isBlockLineRemoved() {
    return this.#inGameData.isBlockLineRemoved;
  }

  get isRemainBlockGoDown() {
    return this.#inGameData.isRemainBlockGoDown;
  }

  get numberOfBlockLine() {
    return this.#inGameData.numberOfBlockLine;
  }

  get boundryToDown() {
    return this.#inGameData.boundryToDown;
  }

  get getBlockLineNumberArray() {
    return this.#inGameData.getBlockLineNumberArray;
  }

  get getBlockLineColors() {
    return this.#inGameData.getBlockLineColors;
  }

  get removedBlockLine() {
    return this.#inGameData.removedBlockLine;
  }

  get targetBlockLineNumberArray() {
    return this.getTargetBlockLineNumberArray();
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
