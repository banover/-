export default class GlobalData {
  #currentBlockArray;
  #currentBlockType;
  #currentKeyPress;
  #lastSavedBlockNumberArray;
  #lastSavedBlockLine;
  #maxHeightBlockLine;
  #removedBlockLine;
  #blockColorArray;
  #isBlockGoingDown;
  #score;
  #gameRunning;

  constructor(MAX_HEIGHT_OF_GAME_MAP, DEFAULT_SCORE) {
    this.#currentBlockArray = null;
    this.#currentBlockType = null;
    this.#currentKeyPress = null;
    this.#lastSavedBlockNumberArray = null;
    this.#lastSavedBlockLine = null;
    this.#maxHeightBlockLine = MAX_HEIGHT_OF_GAME_MAP;
    this.#removedBlockLine = [];
    this.#blockColorArray = null;
    this.#isBlockGoingDown = null;
    this.#score = DEFAULT_SCORE;
    this.#gameRunning = true;
  }

  get currentBlockArray() {
    return this.#currentBlockArray;
  }

  set currentBlockArray(value) {
    this.#currentBlockArray = value;
  }

  get currentBlockType() {
    return this.#currentBlockType;
  }

  set currentBlockType(value) {
    this.#currentBlockType = value;
  }

  get currentKeyPress() {
    return this.#currentKeyPress;
  }

  set currentKeyPress(value) {
    this.#currentKeyPress = value;
  }

  get lastSavedBlockNumberArray() {
    return this.#lastSavedBlockNumberArray;
  }

  set lastSavedBlockNumberArray(value) {
    this.#lastSavedBlockNumberArray = value;
  }

  get lastSavedBlockLine() {
    return this.#lastSavedBlockLine;
  }

  set lastSavedBlockLine(value) {
    this.#lastSavedBlockLine = value;
  }

  get maxHeightBlockLine() {
    return this.#maxHeightBlockLine;
  }

  set maxHeightBlockLine(value) {
    this.#maxHeightBlockLine = value;
  }

  get removedBlockLine() {
    return this.#removedBlockLine;
  }

  set removedBlockLine(value) {
    if (value === 0) {
      // this.#removedBlockLine = [];
      this.#removedBlockLine.length = 0;
    } else {
      this.#removedBlockLine.push(value);
    }
  }

  get blockColorArray() {
    return this.#blockColorArray;
  }

  set blockColorArray(value) {
    this.#blockColorArray = value;
  }

  get isBlockGoingDown() {
    return this.#isBlockGoingDown;
  }

  set isBlockGoingDown(value) {
    this.#isBlockGoingDown = value;
  }

  get score() {
    return this.#score;
  }

  set score(value) {
    this.#score = value;
  }

  get gameRunning() {
    return this.#gameRunning;
  }

  set gameRunning(value) {
    this.#gameRunning = value;
  }
}
