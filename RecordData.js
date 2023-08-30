export default class RecordData {
  #globalData;
  #savedRecord;
  #newRecord;
  #updatedRecord;

  constructor(globalData) {
    this.#globalData = globalData;
    this.#savedRecord = JSON.parse(localStorage.getItem("score"));

    this.#newRecord = this.#globalData.gameRunning
      ? null
      : this.#globalData.score;

    this.#updatedRecord = this.#savedRecord;
    // this.#updatedRecord = this.#savedRecord
    //   ? this.addNewRecord()
    //   : this.makeNewRecord();
  }

  get savedRecord() {
    return this.#savedRecord;
  }
  get newRecord() {
    return this.#newRecord;
  }
  get updatedRecord() {
    return this.#updatedRecord;
  }

  // addNewRecord() {
  //   if (this.#globalData.pause) {
  //     return this.savedRecord;
  //   }

  //   // if (this.newRecord === null) return;
  //   const record = this.savedRecord;
  //   record.push(this.newRecord);
  //   record.sort((a, b) => b - a);

  //   localStorage.setItem("score", JSON.stringify(record.slice(0, 5)));
  //   return JSON.parse(localStorage.getItem("score"));
  // }

  // makeNewRecord() {
  //   localStorage.setItem("score", JSON.stringify([this.newRecord]));
  //   return JSON.parse(localStorage.getItem("score"));
  // }
}
