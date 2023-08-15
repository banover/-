import BlockMoveData from "/BlockMoveData.js";

export default class BlockNumberArray {
  #globalData;
  #newBlockNumberArray;
  constructor(globalData) {
    this.#globalData = globalData;
    this.#newBlockNumberArray = this.makeNewBlockNumberArray();
  }

  get blockNumberArray() {
    return this.#newBlockNumberArray;
  }

  makeNewBlockNumberArray() {
    if (this.#globalData.currentBlockType === "blockLine") {
      return this.#globalData.currentBlockArray.map((b) => `${+b + 10}`);
    }

    if (this.canBlockMove()) {
      if (this.#globalData.currentKeyPress === "ArrowRight") {
        const BlockArray = this.#globalData.currentBlockArray.map(
          (b) => `${+b + 1}`
        );
        this.#globalData.currentBlockArray = BlockArray;

        return this.#globalData.currentBlockArray;
      }
      if (this.#globalData.currentKeyPress === "ArrowLeft") {
        const BlockArray = this.#globalData.currentBlockArray.map(
          (b) => `${+b - 1}`
        );
        this.#globalData.currentBlockArray = BlockArray;

        return this.#globalData.currentBlockArray;
      }

      if (this.#globalData.currentKeyPress === "ArrowUp") {
        if (this.#globalData.currentBlockType === "squre") {
          return this.#globalData.currentBlockArray;
        }

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
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "bar-vertical";

          return this.#globalData.currentBlockArray;
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
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "bar";
          return this.#globalData.currentBlockArray;
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
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "z-vertical";

          return this.#globalData.currentBlockArray;
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
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "z";
          return this.#globalData.currentBlockArray;
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
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "z-reverse-vertical";

          return this.#globalData.currentBlockArray;
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
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "z-reverse";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "gun") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b - 8}`;
            }
            if (i === 1) {
              return `${+b + 1}`;
            }
            if (i === 2) {
              return `${+b + 10}`;
            }
            if (i === 3) {
              return `${+b - 1}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "gun-vertical";

          return this.#globalData.currentBlockArray;
        }
        if (this.#globalData.currentBlockType === "gun-vertical") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b + 8}`;
            }
            if (i === 1) {
              return `${+b + 8}`;
            }
            if (i === 2) {
              return `${+b}`;
            }
            if (i === 3) {
              return `${+b}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "gun-side";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "gun-side") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b}`;
            }
            if (i === 1) {
              return `${+b - 9}`;
            }
            if (i === 2) {
              return `${+b - 1 - 1}`;
            }
            if (i === 3) {
              return `${+b + 10 - 1}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "gun-side-reverse";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "gun-side-reverse") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b + 10}`;
            }
            if (i === 1) {
              return `${+b + 10}`;
            }
            if (i === 2) {
              return `${+b + 2}`;
            }
            if (i === 3) {
              return `${+b + 2}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "gun";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "gun-reverse") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b}`;
            }
            if (i === 1) {
              return `${+b + 9}`;
            }
            if (i === 2) {
              return `${+b + 18}`;
            }
            if (i === 3) {
              return `${+b + 11}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "gun-reverse-vertical";

          return this.#globalData.currentBlockArray;
        }
        if (this.#globalData.currentBlockType === "gun-reverse-vertical") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b + 10}`;
            }
            if (i === 1) {
              return `${+b + 1}`;
            }
            if (i === 2) {
              return `${+b - 8}`;
            }
            if (i === 3) {
              return `${+b - 19}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "gun-reverse-side";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "gun-reverse-side") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b - 10}`;
            }
            if (i === 1) {
              return `${+b - 10}`;
            }
            if (i === 2) {
              return `${+b - 1}`;
            }
            if (i === 3) {
              return `${+b + 19}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "gun-reverse-side-reverse";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "gun-reverse-side-reverse") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b}`;
            }
            if (i === 1) {
              return `${+b}`;
            }
            if (i === 2) {
              return `${+b - 9}`;
            }
            if (i === 3) {
              return `${+b - 11}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "gun-reverse";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "balance") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b}`;
            }
            if (i === 1) {
              return `${+b + 1}`;
            }
            if (i === 2) {
              return `${+b + 1}`;
            }
            if (i === 3) {
              return `${+b + 9}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "balance-vertical";

          return this.#globalData.currentBlockArray;
        }
        if (this.#globalData.currentBlockType === "balance-vertical") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b + 9}`;
            }
            if (i === 1) {
              return `${+b}`;
            }
            if (i === 2) {
              return `${+b}`;
            }
            if (i === 3) {
              return `${+b}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "balance-side";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "balance-side") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b - 9}`;
            }
            if (i === 1) {
              return `${+b - 1}`;
            }
            if (i === 2) {
              return `${+b - 1}`;
            }
            if (i === 3) {
              return `${+b}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "balance-side-reverse";
          return this.#globalData.currentBlockArray;
        }

        if (this.#globalData.currentBlockType === "balance-side-reverse") {
          const blockArray = this.#globalData.currentBlockArray.map((b, i) => {
            if (i === 0) {
              return `${+b}`;
            }
            if (i === 1) {
              return `${+b}`;
            }
            if (i === 2) {
              return `${+b}`;
            }
            if (i === 3) {
              return `${+b - 9}`;
            }
          });
          this.#globalData.currentBlockArray = blockArray;
          this.#globalData.currentBlockType = "balance";
          return this.#globalData.currentBlockArray;
        }
      }

      if (this.#globalData.currentKeyPress === "ArrowDown") {
        const BlockArray = this.#globalData.currentBlockArray.map(
          (b) => `${+b + 10}`
        );
        this.#globalData.currentBlockArray = BlockArray;

        return this.#globalData.currentBlockArray;
      }
    }

    return this.#globalData.currentBlockArray;
  }

  canBlockMove() {
    const dataAboutMove = new BlockMoveData(this.#globalData);

    if (this.canFutureBlockExist(dataAboutMove)) return true;

    return false;
  }

  canFutureBlockExist(data) {
    console.log(data.isFutureBlockOverGameMap);
    if (
      this.#globalData.currentBlockType !== "blockLine" &&
      data.isFutureBlockOverGameMap
    ) {
      return false;
    }

    return data.canfutureBlockPainted();
  }
}
