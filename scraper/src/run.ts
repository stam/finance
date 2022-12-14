import fs from "fs";
import path from "path";
import IngScraper, { MEDIA_DIR } from "./scraper";
import TransactionParser from "./transactionParser";

function cleanupEndpointAfterKill() {
  process.on("exit", () => {
    fs.unlinkSync(path.join(MEDIA_DIR, "wsEndpoint.txt"));
    console.log("Cleaned up detach url");
  });
}

async function cont() {
  let url: string;
  try {
    url = fs.readFileSync(path.join(MEDIA_DIR, "wsEndpoint.txt"), "utf8");
  } catch (e) {}
  const mainProcess = !url;

  const scraper = new IngScraper();
  if (mainProcess) {
    console.log(
      "-- Main process of test-run, please run test-run again in another terminal, and prepare 2FA"
    );
  } else {
    console.log("-- Child process");
  }

  if (mainProcess) {
    await scraper.start(true);
    cleanupEndpointAfterKill();
    return;
  }

  await scraper._attach(url);

  const loggedIn = await scraper._isLoggedIn();
  if (!loggedIn) {
    await scraper.login();
    await scraper.waitForLogin();
  } else {
    await scraper._reset();
  }

  const endDate = "2021-02-24";
  await scraper.downloadTransactions(new Date("2021-02-01"), new Date(endDate));

  const transactionParser = new TransactionParser(
    scraper.bankAccountSummary,
    scraper.transactionCsv
  );
  const data = transactionParser.parse(endDate);

  fs.writeFileSync(path.join(MEDIA_DIR, "aaaaa.csv"), data.csv);
}

cont();
