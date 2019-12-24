import puppeteer from "puppeteer";

export default class INGScraper {
  url = "https://mijn.ing.nl/login";
  page: puppeteer.Page;

  async start() {
    const browser = await puppeteer.launch({ headless: false });
    this.page = await browser.newPage();

    await this.page.setUserAgent(
      "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_14_6) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.88 Safari/537.36"
    );

    console.log(`Connect to: ${browser.wsEndpoint()}`);

    await this.page.setViewport({
      width: 1905,
      height: 969
    });
    await this.page.goto(this.url);
  }

  async attach(wsUrl: string) {
    const browser = await puppeteer.connect({ browserWSEndpoint: wsUrl });
    const pages = await browser.pages();

    const page = pages.find(p => p.url().includes("mijn.ing"));
    this.page = page;
  }

  async waitForLogin() {
    return this.page.waitForNavigation({
      timeout: 0,
      waitUntil: "networkidle0"
    });
  }

  toLocal(date: Date) {
    return date.toLocaleDateString("fr").replace(/\//g, "-");
  }

  async downloadTransactions(from: Date, to: Date) {
    const startDate = this.toLocal(from);
    const endDate = this.toLocal(to);
    console.log("-- Downloading transactions...");

    // @ts-ignore
    await this.page._client.send("Page.setDownloadBehavior", {
      behavior: "allow",
      downloadPath: "./"
    });

    console.log("-- Waiting for the bank button to show up");

    await this.page.waitForFunction(`document
    .querySelector("#app")
    .shadowRoot.querySelector("#start-of-content > dba-overview")
    .shadowRoot.querySelector("ing-orange-agreement-overview")
    .shadowRoot.querySelector(
      "#agreement-cards-panel > article:nth-child(1) > ul > li > a"
    )`);

    console.log("-- Bank button showed up");

    await this.page.waitFor(2000);

    this.page.evaluate(() => {
      const bankButton = <HTMLButtonElement>document
        .querySelector("#app")
        .shadowRoot.querySelector("#start-of-content > dba-overview")
        .shadowRoot.querySelector("ing-orange-agreement-overview")
        .shadowRoot.querySelector(
          "#agreement-cards-panel > article:nth-child(1) > ul > li > a"
        );
      console.log("-- Opening the transactions page", bankButton);
      bankButton.click();
    });

    console.log("-- Openings transactions page");

    await this.page.waitForNavigation({ waitUntil: "networkidle0" });
    await this.page.waitFor(2000);

    this.page.evaluate(() => {
      const manageButton = <HTMLButtonElement>document
        .querySelector("#app")
        .shadowRoot.querySelector("#start-of-content > dba-payment-details")
        .shadowRoot.querySelector("ing-orange-agreement-details-payment")
        .shadowRoot.querySelector("#menuButton");
      console.log("-- Showing additional transaction options", manageButton);
      manageButton.click();
    });

    await this.page.waitFor(500);

    this.page.evaluate(() => {
      const modalButton = <HTMLButtonElement>document
        .querySelector("#app")
        .shadowRoot.querySelector("#start-of-content > dba-payment-details")
        .shadowRoot.querySelector("ing-orange-agreement-details-payment")
        .shadowRoot.querySelector("#detailsMenu > ing-ow-desktop-menu")
        .shadowRoot.querySelector("div > div > ing-ow-menu-items")
        .shadowRoot.querySelector("ul > li:nth-child(1) > button");
      console.log("-- Clicking download transactions button", modalButton);

      modalButton.click();
    });

    await this.page.waitFor(500);

    this.page.evaluate(() => {
      const dateFrom = <HTMLInputElement>document
        .querySelector("dba-download-transactions-dialog")
        .shadowRoot.querySelector("ing-orange-transaction-download-dialog")
        .shadowRoot.querySelector("#downloadFilter")
        .shadowRoot.querySelector(
          "ing-uic-form > form > div:nth-child(3) > div > ing-uic-date-input:nth-child(1)"
        )
        .shadowRoot.querySelector("#viewInput")
        .shadowRoot.querySelector("input");
      dateFrom.value = "";
      dateFrom.focus();
    });
    await this.page.waitFor(100);
    await this.page.keyboard.type(startDate);

    this.page.evaluate(() => {
      const dateTo = <HTMLInputElement>document
        .querySelector(
          "body > div.global-overlays > div.global-overlays__overlay-container.global-overlays__overlay-container--center > div > dba-download-transactions-dialog"
        )
        .shadowRoot.querySelector("ing-orange-transaction-download-dialog")
        .shadowRoot.querySelector("#downloadFilter")
        .shadowRoot.querySelector(
          "ing-uic-form > form > div:nth-child(3) > div > ing-uic-date-input:nth-child(2)"
        )
        .shadowRoot.querySelector("#viewInput")
        .shadowRoot.querySelector("input");
      dateTo.value = "";
      dateTo.focus();
    });

    await this.page.waitFor(100);
    await this.page.keyboard.type(endDate);

    await this.page.waitFor(2000);
    this.page.evaluate(() => {
      const downloadButton = <HTMLButtonElement>document
        .querySelector(
          "body > div.global-overlays > div.global-overlays__overlay-container.global-overlays__overlay-container--center > div > dba-download-transactions-dialog"
        )
        .shadowRoot.querySelector("ing-orange-transaction-download-dialog")
        .shadowRoot.querySelector("#downloadFilter")
        .shadowRoot.querySelector("ing-uic-form > form > paper-button");

      downloadButton.click();
    });
  }
}
