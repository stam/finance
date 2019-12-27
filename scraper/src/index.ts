import express from "express";
// import fs from "fs";
import IngScraper from "./scraper";
import TransactionParser from "./transactionParser";

const app = express();
const port = 8080;

app.post("/", async (req, res) => {
  try {
    const scraper = new IngScraper();
    await scraper.start();
    await scraper.login();
    await scraper.waitForLogin();

    await scraper.downloadTransactions(
      new Date("2019-12-01"),
      new Date("2019-12-30")
    );
    // const summary = fs.readFileSync("./src/mocks/summary.json", "utf8");
    // const transactionCsv = fs.readFileSync(
    //   "./src/mocks/transactions.csv",
    //   "utf8"
    // );

    const transactionParser = new TransactionParser(
      scraper.bankAccountSummary,
      scraper.transactionCsv
    );
    const data = transactionParser.parse();
    res.set("X-Account-Budget", data.balance);
    res.send(data.csv);
  } catch (e) {
    res.statusCode = 400;
    res.send(`Something went wrong: ${e}`);
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
