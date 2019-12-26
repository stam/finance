import moment from "moment";

export default class TransactionParser {
  sourceSummary: any;
  sourceTransactionCsv: string;

  constructor(summary: string, transactionCsv: string) {
    this.sourceSummary = JSON.parse(summary);
    this.sourceTransactionCsv = transactionCsv;
  }

  get latestCsvDate() {
    const str = this.sourceTransactionCsv.split("\n")[1].split(",")[0];

    const date = moment(str, "YYYYMMDD");
    return date.format("YYYY-MM-DD");
  }

  parse() {
    const latestCsvDate = this.latestCsvDate;

    console.log(latestCsvDate);
    // const latestCsvDate =
    // find latest transactions from csv
    // parse json
    // write all transactions from json to csv, mark them as pending
    // add budget somewhere
  }
}
