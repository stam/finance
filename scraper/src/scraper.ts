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
    this.page = pages[pages.length - 1];
  }

  async waitForLogin() {
    const url = this.page.url();

    // if ing check?
    return this.page.waitForNavigation({
      timeout: 0,
      waitUntil: "networkidle0"
    });
  }

  async downloadTransactions(from: Date, to: Date) {
    console.log("Downloading transactions...");
    // await this.page.goto("https://mijn.ing.nl/banking/payments/details");

    // @ts-ignore
    await this.page._client.send("Page.setDownloadBehavior", {
      behavior: "allow"
    });

    this.page.evaluate(() => {
      const bankButton = <HTMLButtonElement>document
        .querySelector("#app")
        .shadowRoot.querySelector("#start-of-content > dba-overview")
        .shadowRoot.querySelector("ing-orange-agreement-overview")
        .shadowRoot.querySelector(
          "#agreement-cards-panel > article:nth-child(1) > ul > li > a"
        );
      bankButton.click();
    });

    await this.page.waitForNavigation();

    this.page.evaluate(() => {
      const manageButton = <HTMLButtonElement>document
        .querySelector("#app")
        .shadowRoot.querySelector("#start-of-content > dba-payment-details")
        .shadowRoot.querySelector("ing-orange-agreement-details-payment")
        .shadowRoot.querySelector("#menuButton");

      console.log("manageButton", manageButton);

      manageButton.click();

      const modalButton = <HTMLButtonElement>document
        .querySelector("#app")
        .shadowRoot.querySelector("#start-of-content > dba-payment-details")
        .shadowRoot.querySelector("ing-orange-agreement-details-payment")
        .shadowRoot.querySelector("#detailsMenu > ing-ow-desktop-menu")
        .shadowRoot.querySelector("div > div > ing-ow-menu-items")
        .shadowRoot.querySelector("ul > li:nth-child(1) > button");

      console.log("modalButton", modalButton);

      modalButton.click();

      const dateFrom = <HTMLInputElement>document
        .querySelector(
          "body > div.global-overlays > div.global-overlays__overlay-container.global-overlays__overlay-container--center > div > dba-download-transactions-dialog"
        )
        .shadowRoot.querySelector("ing-orange-transaction-download-dialog")
        .shadowRoot.querySelector("#downloadFilter")
        .shadowRoot.querySelector(
          "ing-uic-form > form > div:nth-child(3) > div > ing-uic-date-input:nth-child(1)"
        )
        .shadowRoot.querySelector("#viewInput")
        .shadowRoot.querySelector("#ing-uic-native-input_1c");

      dateFrom.value = "01-11-2019";

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
        .shadowRoot.querySelector("#ing-uic-native-input_1e");

      dateTo.value = "30-11-2019";

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
