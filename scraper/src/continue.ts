import IngScraper from "./scraper";

async function cont() {
  const url = process.argv[2];

  const scraper = new IngScraper();
  await scraper.attach(url);

  await scraper.downloadTransactions(
    new Date("2019-11-01"),
    new Date("2019-11-30")
  );
}

cont();
