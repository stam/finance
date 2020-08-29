import fs from "fs";
import path from "path";
import IngScraper, { MEDIA_DIR } from "./scraper";

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
    await scraper.start();
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
  await scraper.downloadTransactions(
    new Date("2020-08-01"),
    new Date("2020-08-28")
  );
}

cont();
