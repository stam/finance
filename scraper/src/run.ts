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
  } else {
    await scraper.attach(url);
  }

  return;

  // await scraper.downloadTransactions(
  //   new Date("2020-08-01"),
  //   new Date("2020-08-29")
  // );
}

cont();
