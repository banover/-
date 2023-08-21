import { NEXT_BLOCK_CENTER_POSITION_NUMBER } from "./config.js";

export default class NextBlockTypeData {
  #nextBlockType;
  #nextBlockTypeNumberArray;
  constructor(globalData) {
    this.#nextBlockType = globalData.nextBlockType;
    this.#nextBlockTypeNumberArray = this.getNextBlockTypeNumberArray();
  }

  get nextBlockType() {
    return this.#nextBlockType;
  }

  get nextBlockTypeNumberArray() {
    return this.#nextBlockTypeNumberArray;
  }

  getNextBlockTypeNumberArray(globalData) {
    if (this.nextBlockType === null) return null;
    if (this.nextBlockType === "squre") return this.makeSqureNumberArray();
    if (this.nextBlockType === "bar") return this.makeBarNumberArray();
    if (this.nextBlockType === "z") return this.makeZNumberArray();
    if (this.nextBlockType === "z-reverse")
      return this.makeZreverseNumberArray();

    if (this.nextBlockType === "gun") return this.makeGunNumberArray();
    if (this.nextBlockType === "gun-reverse")
      return this.makeGunReverseNumberArray();
    if (this.nextBlockType === "balance") return this.makeBalanceNumberArray();
  }

  makeSqureNumberArray() {
    return [
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 4}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 5}`,
    ];
  }

  makeBarNumberArray() {
    return [
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER - 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 2}`,
    ];
  }

  makeZNumberArray() {
    return [
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER - 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 4}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 5}`,
    ];
  }

  makeZreverseNumberArray() {
    return [
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 3}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 4}`,
    ];
  }
  makeGunNumberArray() {
    return [
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER - 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 5}`,
    ];
  }

  makeGunReverseNumberArray() {
    return [
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER - 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 1}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 3}`,
    ];
  }

  makeBalanceNumberArray() {
    return [
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 3}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 4}`,
      `${NEXT_BLOCK_CENTER_POSITION_NUMBER + 5}`,
    ];
  }
}
