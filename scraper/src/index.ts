import express from "express";
import fs from "fs";
import TransactionParser from "./transactionParser";

const app = express();
const port = 8080;

app.post("/", (req, res) => {
  try {
    const summary = fs.readFileSync("./src/mocks/summary.json", "utf8");
    const transactionCsv = fs.readFileSync(
      "./src/mocks/transactions.csv",
      "utf8"
    );

    const transactionParser = new TransactionParser(summary, transactionCsv);
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
