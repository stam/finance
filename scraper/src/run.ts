import IngScraper from "./scraper";
import TransactionParser from "./transactionParser";
import fs from "fs";

async function run() {
  const scraper = new IngScraper();
  await scraper.login();
  // await scraper.waitForLogin();

  // await scraper.downloadTransactions(
  //   new Date("2019-12-01"),
  //   new Date("2019-12-30")
  // );

  // const summary = fs.readFileSync("./src/mocks/summary.json", "utf8");
  // const transactionCsv = fs.readFileSync(
  //   "./src/mocks/transactions.csv",
  //   "utf8"
  // );

  // const transactionParser = new TransactionParser(summary, transactionCsv);
  // transactionParser.parse();

  // todo close
}

run();
