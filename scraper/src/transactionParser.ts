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

  findPendingTransactions(after: string) {
    const { transactions } = this.sourceSummary;

    return transactions.filter(t => t.executionDate > after);
  }

  formatSubjectLines(input: string[]) {
    // the first line is the summary itself
    const lines = input.slice(1);

    // the transaction line contains trailing whitespaces
    // if we strip it correctly, we should get the exact same details so our hash checking works
    const cleanedLines = lines.map(l => l.trimEnd());
    return cleanedLines.join(" ");
  }

  formatTransactionToCsv = t => {
    const output = {
      date: moment(t.executionDate).format("YYYYMMDD"),
      summary: t.subject,
      amount: t.amount.value.replace("-", "").replace(".", ","),
      details: this.formatSubjectLines(t.subjectLines),
      direction: t.amount.value.includes("-") ? "Af" : "Bij",
      type: "PENDING"
    };

    return `"${output.date}","${output.summary}","NL??INGB???????REK","NL??INGB???????TEG","","${output.direction}","${output.amount}","${output.type}","${output.details}"`;
  };

  parse() {
    const latestCsvDate = this.latestCsvDate;
    const pendingTransactions = this.findPendingTransactions(latestCsvDate);

    const formattedTransactions = pendingTransactions.map(
      this.formatTransactionToCsv
    );

    const balance = this.sourceSummary.availableBalance.value;
    console.log(formattedTransactions);
  }
}
