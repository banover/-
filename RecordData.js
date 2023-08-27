export default class RecordData {
  #savedRecord;
  #newRecord;
  #updatedRecord;

  constructor(globalData) {
    this.#savedRecord = JSON.parse(localStorage.getItem("score"));
    this.#newRecord = globalData.score;
    this.#updatedRecord = this.#savedRecord
      ? this.addNewRecord()
      : this.makeNewRecord();
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

  addNewRecord() {
    const record = this.savedRecord;
    record.push(this.newRecord);
    record.sort((a, b) => b - a);
    // const sortedRecord = savedRecord.slice(0, 5);
    localStorage.setItem("score", JSON.stringify(record.slice(0, 5)));
    return JSON.parse(localStorage.getItem("score"));
  }

  makeNewRecord() {
    localStorage.setItem("score", JSON.stringify([this.newRecord]));
    return JSON.parse(localStorage.getItem("score"));
  }
}
