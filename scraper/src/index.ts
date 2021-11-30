import express from "express";
import IngScraper from "./scraper";
import bodyParser from "body-parser";
import TransactionParser from "./transactionParser";

const app = express();
const port = 8080;

let running = false;

app.use(bodyParser.json());

app.post("/", async (req, res) => {
  console.log("[Request] Received request");
  if (running) {
    res.statusCode = 503;
    res.send("Server busy");
    console.log("[Request] Server busy");
    return;
  }
  running = true;

  let scraper: IngScraper;
  try {
    const { startDate, endDate } = req.body;
    scraper = new IngScraper();
    await scraper.start();
    await scraper.login();
    await scraper.waitForLogin();

    try {
      await scraper.downloadTransactions(
        new Date(startDate),
        new Date(endDate)
      );
    } catch (e) {
      console.error(`❌ Scraping failed at step: ${scraper.state}`);
      throw e;
    }
    scraper.stop();

    const transactionParser = new TransactionParser(
      scraper.bankAccountSummary,
      scraper.transactionCsv
    );
    const data = transactionParser.parse(endDate);
    res.set("X-Account-Budget", data.balance);
    res.send(data.csv);
    console.log(`[Request] Complete ${data.balance}`);
  } catch (e) {
    res.statusCode = 400;
    console.log(`[Request] Something went wrong ${e}`);
    res.send(`Something went wrong: ${e}`);
    scraper.stop();
  } finally {
    running = false;
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
