import express from "express";
import IngScraper from "./scraper";
import bodyParser from "body-parser";
import TransactionParser from "./transactionParser";

const app = express();
const port = 8080;

let scraper: IngScraper;
let errorMessage: string;

app.use(bodyParser.json());

app.get("/status", async (req, res) => {
  if (errorMessage) {
    res.send({
      status: "failed",
      errorMessage,
    });
    return;
  }
  if (!scraper) {
    res.send({ status: "idle" });
    return;
  }

  res.send({
    status: "busy",
    log: scraper.log,
  });
});

app.post("/", async (req, res) => {
  console.log("[Request] Received request");
  if (scraper) {
    res.statusCode = 503;
    res.send("Server busy");
    console.log("[Request] Server busy");
    return;
  }

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
      errorMessage = `Scraping failed at step: ${scraper.state}`;
      console.error(errorMessage);
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
    errorMessage = undefined;
  } catch (e) {
    res.statusCode = 400;
    console.log(`[Request] Something went wrong ${e}`);
    res.send(errorMessage);
    scraper.stop();
  } finally {
    scraper = undefined;
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
