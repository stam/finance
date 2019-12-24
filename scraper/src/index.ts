import IngScraper from "./scraper";

async function run() {
  const scraper = new IngScraper();
  await scraper.start();
  await scraper.waitForLogin();

  await scraper.downloadTransactions(
    new Date("2019-11-01"),
    new Date("2019-11-30")
  );
}

run();
